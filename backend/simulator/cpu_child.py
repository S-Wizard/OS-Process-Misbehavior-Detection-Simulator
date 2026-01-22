import sys
import threading
import time

# Read arguments
intensity = int(sys.argv[1])      # 0–100
duration = int(sys.argv[2])       # seconds
threads = int(sys.argv[3])        # number of threads

stop_time = time.time() + duration

def cpu_burn():
    while time.time() < stop_time:
        # Busy loop proportional to intensity
        work_time = intensity / 100.0
        start = time.time()
        while time.time() - start < work_time * 0.01:
            pass
        time.sleep((1 - work_time) * 0.01)

# Start threads
thread_list = []
for _ in range(threads):
    t = threading.Thread(target=cpu_burn)
    t.start()
    thread_list.append(t)

for t in thread_list:
    t.join()
