from flask import Blueprint, jsonify, request
import psutil
from simulator.attack_dispatcher import launch_attack
from app.state import simulation_state

api_bp = Blueprint('api', __name__)

@api_bp.route("/metrics")
def metrics():
    return jsonify(simulation_state.get_metrics())

@api_bp.route("/alerts")
def alerts():
    return jsonify(simulation_state.get_alerts())

@api_bp.route("/logs")
def logs():
    return jsonify(simulation_state.get_logs())

@api_bp.route("/clear", methods=["POST"])
def clear_data():
    target = request.json.get("target", "all") if request.json else "all"
    if target in ["logs", "all"]:
        simulation_state.clear_logs()
    if target in ["alerts", "all"]:
        simulation_state.clear_alerts()
    return jsonify({"message": f"Cleared: {target}"})


@api_bp.route("/status")
def status():
    """Returns system health and protection states"""
    metrics = simulation_state.get_metrics()
    attack_pids = simulation_state.get_attack_pids()
    
    # Calculate system health (simplified heuristic)
    # Health decreases when CPU is high or attacks are active
    cpu_data = metrics.get("cpu", [])
    current_cpu = cpu_data[-1] if cpu_data else 0
    
    active_attacks = sum(1 for pid in attack_pids.values() if pid is not None)
    
    # Base health 100%, reduce by CPU usage impact and active attacks
    health = 100 - (current_cpu * 0.3) - (active_attacks * 15)
    health = max(0, min(100, health))  # Clamp between 0-100
    
    # Protections
    protections = simulation_state.get_protections()
    active_count = sum(1 for v in protections.values() if v)
    
    return jsonify({
        "health": round(health),
        "protections": protections,
        "active_protections_count": active_count,
        "active_attacks": active_attacks
    })

@api_bp.route("/protections/toggle", methods=["POST"])
def toggle_protection():
    data = request.json
    protection = data.get("protection")
    if not protection:
        return {"error": "Protection name required"}, 400
    
    new_state = simulation_state.toggle_protection(protection)
    if new_state is None:
        return {"error": f"Unknown protection: {protection}"}, 400
    
    status_msg = "enabled" if new_state else "disabled"
    simulation_state.add_log(f"[CONFIG] {protection} {status_msg}")
    
    return jsonify({"protection": protection, "enabled": new_state})

@api_bp.route("/thresholds")
def get_thresholds():
    return jsonify(simulation_state.get_thresholds())

@api_bp.route("/thresholds/update", methods=["POST"])
def update_threshold():
    data = request.json
    key = data.get("key")
    value = data.get("value")
    
    if not key or value is None:
        return {"error": "Key and value required"}, 400
        
    new_val = simulation_state.update_threshold(key, value)
    if new_val is None:
        return {"error": f"Unknown threshold: {key}"}, 400
        
    simulation_state.add_log(f"[CONFIG] Updated {key} threshold to {new_val}")
    return jsonify({"key": key, "value": new_val})



@api_bp.route("/attack/create", methods=["POST"])
def create_attack():
    data = request.json
    attack_type = data.get("type")
    params = data.get("params", {})

    if not attack_type:
        return {"error": "Attack type required"}, 400

    try:
        # Launch attack process
        proc = launch_attack(attack_type, params)
    except ValueError as e:
        return {"error": str(e)}, 400

    # Register PID
    simulation_state.set_attack_pid(attack_type, proc.pid)

    # Logs
    marker = f"[ATTACK_START] {attack_type.upper()} PID={proc.pid}"
    simulation_state.add_log(marker)
    simulation_state.add_log(f"[INFO] {attack_type.upper()} process created (PID {proc.pid})")
    
    # Capture output in a separate thread
    def capture_output(process, atk_type):
        if not process.stdout: return
        
        from detector.rules import ACCESS_VIOLATION_THRESHOLD
        violation_count = 0
        
        try:
            for line in iter(process.stdout.readline, ''):
                if line:
                    msg = line.strip()
                    simulation_state.add_log(f"[{atk_type.upper()}] {msg}")
                    
                    # Detection for ACCESS violations (only if access_monitor is enabled)
                    protections = simulation_state.get_protections()
                    thresholds = simulation_state.get_thresholds()
                    access_limit = thresholds.get("access_count", 5)
                    
                    if atk_type == "access" and "ACCESS_VIOLATION" in msg and protections.get("access_monitor", True):
                        violation_count += 1
                        
                        if violation_count >= access_limit:
                            # Trigger detection alert
                            alert_msg = f"ACCESS ABUSE DETECTED | PID={process.pid} | {violation_count} unauthorized attempts (Limit: {access_limit})"
                            simulation_state.add_alert(alert_msg)
                            simulation_state.add_log(f"[DETECT] {alert_msg}")
                            
                            # Auto-terminate
                            try:
                                process.terminate()
                                action = f"ACTION TAKEN: Terminated Access Attack (PID {process.pid}) after {violation_count} violations"
                                simulation_state.add_log(f"[ACTION] {action}")
                                simulation_state.set_attack_pid("access", None)
                            except:
                                pass
                            break

        except Exception:

            pass
            
    import threading
    t = threading.Thread(target=capture_output, args=(proc, attack_type), daemon=True)
    t.start()
    
    # Record attack in history
    import time
    simulation_state.record_attack({
        "type": attack_type,
        "pid": proc.pid,
        "start_time": time.strftime("%H:%M:%S"),
        "status": "Started",
        "outcome": "Running"
    })

    return {
        "message": f"{attack_type.upper()} attack created",
        "pid": proc.pid,
        "marker": marker
    }

@api_bp.route("/attack/stop", methods=["POST"])
def stop_attacks():
    pids = simulation_state.get_attack_pids()
    
    for atk, pid in pids.items():
        if pid:
            try:
                psutil.Process(pid).terminate()
                simulation_state.add_log(
                    f"[ACTION] Attack process {atk.upper()} (PID {pid}) terminated"
                )
            except Exception:
                pass
            
            simulation_state.set_attack_pid(atk, None)

    simulation_state.add_log("[STATUS] System stabilized after stopping attacks")
    return {"message": "All attacks stopped"}

@api_bp.route("/history")
def history():
    return jsonify(simulation_state.get_attack_history())
