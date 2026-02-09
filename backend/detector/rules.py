# Detection thresholds (can be tuned later)

CPU_THRESHOLD = 80.0       # percent
CPU_DURATION = 3           # seconds

# Memory rules
MEMORY_THRESHOLD_MB = 300    # safe value, adjust if needed
MEMORY_DURATION = 3          # seconds

# Access Violation rules
ACCESS_VIOLATION_THRESHOLD = 5   # Number of violations before detection
ACCESS_VIOLATION_WINDOW = 10     # Seconds to track violations
