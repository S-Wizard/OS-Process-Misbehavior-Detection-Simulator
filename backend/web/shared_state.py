# This file holds live system data for the web UI

shared_data = {
    "cpu": [],        # list of CPU values over time
    "memory": [],     # list of memory values over time
    "alerts": [],     # recent alerts
    "logs": []        # recent logs
}

attack_pids = {
    "cpu": None,
    "memory": None,
    "access": None
}

MAX_POINTS = 60  # keep last 60 seconds of data
