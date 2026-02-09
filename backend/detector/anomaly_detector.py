import psutil
import time
import os
from logs.logger import log_event
from app.state import simulation_state
from detector.rules import (
    CPU_THRESHOLD, CPU_DURATION,
    MEMORY_THRESHOLD_MB, MEMORY_DURATION
)

def detect_resource_abuse():
    """
    Monitors main process + active attack processes.
    Aggregates metrics for charts.
    Detects abuse on individual processes.
    """
    main_pid = os.getpid()
    
    # Track duration of abuse for each PID
    abuse_trackers = {} # {pid: {cpu_start: time, mem_start: time}}
    
    print("[DETECTOR] Resource abuse detection started...\n")

    # Cache process objects to maintain CPU delta state
    # {pid: psutil.Process}
    stats_cache = {} 

    while True:
        try:
            # 1. Identify PIDs to monitor
            current_target_pids = set()
            current_target_pids.add(main_pid)
            
            attack_pids_map = simulation_state.get_attack_pids()
            for atk_type, pid in attack_pids_map.items():
                if pid:
                    current_target_pids.add(int(pid)) # Ensure int
            
            # Sync cache with current targets (remove old, add new)
            # Remove dead/stopped PIDs
            cached_pids = list(stats_cache.keys())
            for pid in cached_pids:
                if pid not in current_target_pids:
                    del stats_cache[pid]
            
            # Add new PIDs
            for pid in current_target_pids:
                if pid not in stats_cache:
                    try:
                        p = psutil.Process(pid)
                        # Initialize CPU counter
                        p.cpu_percent(interval=None) 
                        stats_cache[pid] = p
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        pass

            # 2. Collect Metrics
            total_cpu = 0
            total_mem_mb = 0
            
            # Iterate over the CACHED processes (the stable objects)
            # Use list() to avoid runtime error if dict changes (though it shouldn't here)
            for pid, proc in list(stats_cache.items()):
                try:
                    if not proc.is_running():
                        del stats_cache[pid]
                        continue

                    # CPU: Since we sleep(1) at bottom, this gives avg usage over last 1s
                    # This call compares against the previous call stored in 'proc' object
                    p_cpu = proc.cpu_percent(interval=None) 
                    
                    # Memory
                    p_mem_mb = proc.memory_info().rss / (1024 * 1024)
                    
                    total_cpu += p_cpu
                    total_mem_mb += p_mem_mb
                    
                    # 3. Anomaly Checks (Per Process)
                    label = "MAIN" if pid == main_pid else "ATTACK"
                    check_process_abuse(pid, p_cpu, p_mem_mb, abuse_trackers, label)
                    
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    # Process died
                    if pid in stats_cache: del stats_cache[pid]
                    continue
            
            # 4. Update Global State
            simulation_state.add_metric(total_cpu, total_mem_mb)
            
            time.sleep(1)
            
        except Exception as e:
            print(f"[DETECTOR ERROR] {e}")
            import traceback
            traceback.print_exc()
            time.sleep(1)

def check_process_abuse(pid, cpu, mem_mb, trackers, label):
    if pid not in trackers:
        trackers[pid] = {"cpu_start": None, "mem_start": None}
        
    t = trackers[pid]
    
    # Get current protection states and thresholds
    protections = simulation_state.get_protections()
    thresholds = simulation_state.get_thresholds()
    
    cpu_limit = thresholds.get("cpu", 80.0)
    mem_limit = thresholds.get("memory", 300)
    
    # --- CPU Check (only if cpu_detector is enabled) ---
    if protections.get("cpu_detector", True) and cpu > cpu_limit:
        if t["cpu_start"] is None:
            t["cpu_start"] = time.time()
        elif time.time() - t["cpu_start"] >= CPU_DURATION:
            msg = f"CPU ABUSE DETECTED | Process {pid} ({label}) | CPU: {cpu:.1f}% (Limit: {cpu_limit}%)"
            # Throttling alerts to avoid spam
            if int(time.time()) % 2 == 0: 
                print(f"[ALERT] {msg}")
                simulation_state.add_alert(msg)
                simulation_state.add_log(f"[DETECT] {msg}")
    else:
        t["cpu_start"] = None

    # --- Memory Check (only if memory_detector is enabled) ---
    if protections.get("memory_detector", True) and mem_mb > mem_limit:
        if t["mem_start"] is None:
            t["mem_start"] = time.time()
        elif time.time() - t["mem_start"] >= MEMORY_DURATION:
            msg = f"MEMORY ABUSE DETECTED | Process {pid} ({label}) | Mem: {mem_mb:.1f}MB (Limit: {mem_limit}MB)"
            print(f"[ALERT] {msg}")
            simulation_state.add_alert(msg)
            simulation_state.add_log(f"[DETECT] {msg}")
            
            # Auto-action: Terminate if it's an attack process
            if label != "MAIN":
                try:
                    psutil.Process(pid).terminate()
                    action = f"ACTION TAKEN: Terminated Process {pid} ({label}) due to memory abuse"
                    simulation_state.add_log(f"[ACTION] {action}")
                    # Clear from state tracking
                    game_state_cleanup(label)
                except:
                    pass
            t["mem_start"] = None # Reset
    else:
        t["mem_start"] = None



def game_state_cleanup(attack_type):
    # Helper to clear pid from state if killed
    pass # Managed by next polling loop essentially, but ideally we explicitly clear it
