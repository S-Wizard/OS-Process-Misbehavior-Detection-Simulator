import psutil
import time
import os
from logs.logger import log_event
from detector.rules import (
    CPU_THRESHOLD, CPU_DURATION,
    MEMORY_THRESHOLD_MB, MEMORY_DURATION
)

def detect_resource_abuse():
    """
    Detect CPU and Memory abuse.
    Auto-terminate process on MEMORY abuse.
    """
    process = psutil.Process(os.getpid())

    cpu_abuse_start = None
    mem_abuse_start = None

    print("[DETECTOR] Resource abuse detection started...\n")

    while True:
        # ---------- CPU CHECK ----------
        cpu = process.cpu_percent(interval=1)

        if cpu > CPU_THRESHOLD:
            if cpu_abuse_start is None:
                cpu_abuse_start = time.time()
            else:
                duration = time.time() - cpu_abuse_start
                if duration >= CPU_DURATION:
                    msg = (
                        f"CPU ABUSE DETECTED | "
                        f"CPU: {cpu:.2f}% | Duration: {int(duration)}s"
                    )
                    print("[ALERT]", msg)
                    log_event(msg)
                    cpu_abuse_start = None
        else:
            cpu_abuse_start = None

        # ---------- MEMORY CHECK ----------
        mem_mb = process.memory_info().rss / (1024 * 1024)

        if mem_mb > MEMORY_THRESHOLD_MB:
            if mem_abuse_start is None:
                mem_abuse_start = time.time()
            else:
                duration = time.time() - mem_abuse_start
                if duration >= MEMORY_DURATION:
                    msg = (
                        f"MEMORY ABUSE DETECTED | "
                        f"Memory: {mem_mb:.2f} MB | Duration: {int(duration)}s"
                    )
                    print("[ALERT]", msg)
                    log_event(msg)

                    action = "ACTION TAKEN: Process terminated due to memory abuse"
                    print("[ACTION]", action)
                    log_event(action)

                    process.terminate()
                    return
        else:
            mem_abuse_start = None
