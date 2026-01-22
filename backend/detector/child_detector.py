import psutil
import time
from logs.logger import log_event
from web.shared_state import shared_data, attack_pids, MAX_POINTS

CPU_THRESHOLD = 80.0
MEMORY_THRESHOLD_MB = 300
RESOURCE_DURATION = 3
ACCESS_VIOLATION_LIMIT = 3


def monitor_child_process():
    resource_tracker = {
        "cpu": 0,
        "memory": 0,
        "access": 0
    }

    print("[DETECTOR] Dynamic attack monitoring started...\n")

    while True:
        for attack_type, pid in attack_pids.items():
            if pid is None:
                resource_tracker[attack_type] = 0
                continue

            try:
                proc = psutil.Process(pid)

                # ---- ACCESS ATTACK ----
                if attack_type == "access":
                    resource_tracker["access"] += 1

                    if resource_tracker["access"] >= ACCESS_VIOLATION_LIMIT:
                        msg = f"UNAUTHORIZED ACCESS DETECTED | PID {pid}"
                        print("[ALERT]", msg)
                        log_event(msg)

                        shared_data["alerts"].append(msg)
                        shared_data["alerts"] = shared_data["alerts"][-10:]

                        proc.terminate()
                        log_event(f"ACTION: Terminated access attack PID {pid}")

                        shared_data["logs"].append(
                            f"ACTION: Terminated access attack PID {pid}"
                        )
                        shared_data["logs"] = shared_data["logs"][-20:]

                        attack_pids["access"] = None
                        resource_tracker["access"] = 0

                    continue

                # ---- CPU / MEMORY ATTACKS ----
                cpu = proc.cpu_percent(interval=1)   # per-core CPU (0–100)
                mem = proc.memory_info().rss / (1024 * 1024)

                shared_data["cpu"].append(cpu)
                shared_data["memory"].append(mem)

                if len(shared_data["cpu"]) > MAX_POINTS:
                    shared_data["cpu"].pop(0)
                    shared_data["memory"].pop(0)

                if cpu > CPU_THRESHOLD or mem > MEMORY_THRESHOLD_MB:
                    resource_tracker[attack_type] += 1
                else:
                    resource_tracker[attack_type] = 0

                if resource_tracker[attack_type] >= RESOURCE_DURATION:
                    msg = (
                        f"{attack_type.upper()} ABUSE DETECTED | "
                        f"PID {pid} | CPU {cpu:.2f}% | MEM {mem:.2f} MB"
                    )
                    print("[ALERT]", msg)
                    log_event(msg)

                    shared_data["alerts"].append(msg)
                    shared_data["alerts"] = shared_data["alerts"][-10:]

                    proc.terminate()
                    log_event(f"ACTION: Terminated {attack_type} attack PID {pid}")

                    shared_data["logs"].append(
                        f"ACTION: Terminated {attack_type} attack PID {pid}"
                    )
                    shared_data["logs"] = shared_data["logs"][-20:]

                    attack_pids[attack_type] = None
                    resource_tracker[attack_type] = 0

            except psutil.NoSuchProcess:
                attack_pids[attack_type] = None
                resource_tracker[attack_type] = 0

        time.sleep(0.2)
