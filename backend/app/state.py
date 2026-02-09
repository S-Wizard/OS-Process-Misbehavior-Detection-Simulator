import threading
from app.config import Config

class SimulationState:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.cpu_data = []
        self.memory_data = []
        self.alerts = []
        self.logs = []
        self.attack_history = []
        self.attack_pids = {
            "cpu": None,
            "memory": None,
            "access": None
        }
        # Protections are always active in this simulator
        self.protections = {
            "cpu_detector": True,
            "memory_detector": True,
            "access_monitor": True
        }
        
        # Load defaults from rules
        from detector.rules import (
            CPU_THRESHOLD, MEMORY_THRESHOLD_MB, ACCESS_VIOLATION_THRESHOLD
        )
        self.thresholds = {
            "cpu": CPU_THRESHOLD,
            "memory": MEMORY_THRESHOLD_MB,
            "access_count": ACCESS_VIOLATION_THRESHOLD
        }

    @classmethod
    def get_instance(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls()
        return cls._instance

    def add_metric(self, cpu, memory):
        with self._lock:
            self.cpu_data.append(cpu)
            self.memory_data.append(memory)
            
            if len(self.cpu_data) > Config.MAX_POINTS:
                self.cpu_data.pop(0)
                self.memory_data.pop(0)

    def add_log(self, message):
        import time
        with self._lock:
            entry = {
                "time": time.strftime("%H:%M:%S"),
                "message": message
            }
            self.logs.append(entry)
            if len(self.logs) > Config.MAX_LOGS:
                self.logs.pop(0)

    def add_alert(self, message):
        with self._lock:
            self.alerts.append(message)
            if len(self.alerts) > Config.MAX_ALERTS:
                self.alerts.pop(0)

    def set_attack_pid(self, attack_type, pid):
        with self._lock:
            self.attack_pids[attack_type] = pid

    def get_attack_pids(self):
        with self._lock:
             return self.attack_pids.copy()
             
    def get_metrics(self):
        with self._lock:
            return {
                "cpu": list(self.cpu_data),
                "memory": list(self.memory_data)
            }
            
    def get_logs(self):
        with self._lock:
            return list(self.logs)
            
    def get_alerts(self):
        with self._lock:
            return list(self.alerts)
    
    def clear_logs(self):
        with self._lock:
            self.logs = []
    
    def clear_alerts(self):
        with self._lock:
            self.alerts = []
    
    def toggle_protection(self, protection_name):
        with self._lock:
            if protection_name in self.protections:
                self.protections[protection_name] = not self.protections[protection_name]
                return self.protections[protection_name]
        return None
    
    def get_protections(self):
        with self._lock:
            return self.protections.copy()

    def get_thresholds(self):
        with self._lock:
             return self.thresholds.copy()
             
    def update_threshold(self, key, value):
        with self._lock:
            if key in self.thresholds:
                self.thresholds[key] = float(value)
                return self.thresholds[key]
        return None

    def record_attack(self, attack_data):
        with self._lock:
            self.attack_history.insert(0, attack_data)
            if len(self.attack_history) > 50:
                self.attack_history.pop()

    def get_attack_history(self):
        with self._lock:
             return list(self.attack_history)



# Global Access Point
simulation_state = SimulationState.get_instance()
