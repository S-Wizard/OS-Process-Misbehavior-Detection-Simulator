import psutil
import time

def monitor_processes(interval=2):
    """
    Monitors running processes and prints CPU & memory usage
    """
    print("Monitoring processes... (Press Ctrl+C to stop)\n")

    try:
        while True:
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                try:
                    pid = proc.info['pid']
                    name = proc.info['name']
                    cpu = proc.info['cpu_percent']
                    memory = proc.info['memory_percent']

                    if cpu > 0:
                        print(f"PID: {pid} | Process: {name} | CPU: {cpu}% | Memory: {memory:.2f}%")

                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue

            print("-" * 60)
            time.sleep(interval)

    except KeyboardInterrupt:
        print("\nMonitoring stopped.")
