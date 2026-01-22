import time

def memory_leak(duration=10, step_mb=50):
    """
    Simulates memory abuse by gradually allocating memory.
    """
    print(f"[MEMORY ATTACK] Starting memory leak for {duration} seconds...")

    data = []
    start_time = time.time()

    try:
        while time.time() - start_time < duration:
            # Allocate memory in chunks
            data.append(bytearray(step_mb * 1024 * 1024))
            print(f"[MEMORY ATTACK] Allocated {len(data) * step_mb} MB")
            time.sleep(1)

    except MemoryError:
        print("[MEMORY ATTACK] Memory limit reached!")

    print("[MEMORY ATTACK] Memory leak finished.")
