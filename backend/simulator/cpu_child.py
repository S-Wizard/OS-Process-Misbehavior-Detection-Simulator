import sys
import time
import threading
import os

def cpu_worker(end_time, intensity):
    """
    Burn CPU cycles in a busy loop.
    Intensity controls duty cycle (0-100).
    """
    while time.time() < end_time:
        # Active phase
        active_start = time.time()
        while time.time() - active_start < (intensity / 100.0):
            _ = 9999 * 9999  # Burn cycles
        
        # Rest phase proportional to 100 - intensity
        rest_time = max(0.0, (100 - intensity) / 1000.0)
        if rest_time > 0:
            time.sleep(rest_time)

if __name__ == "__main__":
    try:
        intensity = int(sys.argv[1])
        duration = float(sys.argv[2])
        threads_count = int(sys.argv[3])
    except IndexError:
        intensity = 90
        duration = 10
        threads_count = os.cpu_count() or 4

    print(f"[CPU_ATTACK] PID={os.getpid()} | Intensity={intensity}% | Duration={duration}s | Threads={threads_count}")
    
    end_time = time.time() + duration
    threads = []

    # Launch worker threads (Python GIL means limited true parallelism, but
    # they all contribute to the process's CPU% reading)
    for _ in range(threads_count):
        t = threading.Thread(target=cpu_worker, args=(end_time, intensity))
        t.start()
        threads.append(t)
    
    for t in threads:
        t.join()
        
    print(f"[CPU_ATTACK] Finished | PID={os.getpid()}")
