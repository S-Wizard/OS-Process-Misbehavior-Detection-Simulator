import sys
import time

# Arguments
attempts_per_sec = int(sys.argv[1])
total_attempts = int(sys.argv[2])
delay = float(sys.argv[3])
violation_type = sys.argv[4]

attempts = 0

while attempts < total_attempts:
    for _ in range(attempts_per_sec):
        attempts += 1
        print(f"[ACCESS_VIOLATION] {violation_type} attempt {attempts}")
        time.sleep(delay)

    time.sleep(1)
