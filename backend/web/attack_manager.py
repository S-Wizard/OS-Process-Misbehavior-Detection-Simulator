import subprocess
from web.shared_state import attack_pids, shared_data

def start_cpu_attack():
    if attack_pids["cpu"] is None:
        proc = subprocess.Popen(["python", "simulator/cpu_child.py"])
        attack_pids["cpu"] = proc.pid
        shared_data["logs"].append(f"CPU attack started (PID {proc.pid})")
        return "CPU attack started"
    return "CPU attack already running"

def start_memory_attack():
    if attack_pids["memory"] is None:
        proc = subprocess.Popen(["python", "simulator/memory_child.py"])
        attack_pids["memory"] = proc.pid
        shared_data["logs"].append(f"Memory attack started (PID {proc.pid})")
        return "Memory attack started"
    return "Memory attack already running"

def start_access_attack():
    if attack_pids["access"] is None:
        proc = subprocess.Popen(["python", "simulator/unauthorized_child.py"])
        attack_pids["access"] = proc.pid
        shared_data["logs"].append(f"Access attack started (PID {proc.pid})")
        return "Access attack started"
    return "Access attack already running"

def stop_all_attacks():
    from psutil import Process

    stopped = []
    for key, pid in attack_pids.items():
        if pid is not None:
            try:
                Process(pid).terminate()
                stopped.append(key)
            except:
                pass
            attack_pids[key] = None

    shared_data["logs"].append("All attacks stopped")
    return "All attacks stopped"
