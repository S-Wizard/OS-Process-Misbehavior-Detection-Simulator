class Config:
    # Monitoring Constants
    CPU_THRESHOLD = 80.0
    MEMORY_THRESHOLD_MB = 300
    RESOURCE_DURATION = 3
    ACCESS_VIOLATION_LIMIT = 3
    
    # Data Retention
    MAX_POINTS = 60  # Keep last 60 seconds of data
    MAX_LOGS = 50
    MAX_ALERTS = 10
