import time
import threading
import os

def cpu_worker(end_time):
    while time.time() < end_time:
        pass

def cpu_spike(duration=5):
    """
    Simulates high CPU usage on all cores
    """
    print(f"[CPU ATTACK] Starting CPU spike for {duration} seconds...")

    end_time = time.time() + duration
    threads = []

    core_count = os.cpu_count()

    for _ in range(core_count):
        t = threading.Thread(target=cpu_worker, args=(end_time,))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    print("[CPU ATTACK] CPU spike finished.")
