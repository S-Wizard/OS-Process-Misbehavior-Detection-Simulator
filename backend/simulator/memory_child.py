import sys
import time

# Arguments
chunk_mb = int(sys.argv[1])      # MB per allocation
interval = float(sys.argv[2])    # seconds between allocations
duration = int(sys.argv[3])      # total duration

memory = []
end_time = time.time() + duration

allocated = 0

while time.time() < end_time:
    # Allocate memory
    memory.append(bytearray(chunk_mb * 1024 * 1024))
    allocated += chunk_mb
    print(f"[MEMORY] Allocated {allocated} MB")

    time.sleep(interval)
