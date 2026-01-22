from simulator.attack_dispatcher import launch_attack
from web.attack_manager import (
    start_cpu_attack,
    start_memory_attack,
    start_access_attack,
    stop_all_attacks
)
from flask import Flask, jsonify, render_template
from web.shared_state import shared_data
from flask import request
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

'''
@app.route("/")
def dashboard():
    return render_template("dashboard.html")
'''

@app.route("/api/metrics")
def metrics():
    return jsonify({
        "cpu": shared_data["cpu"],
        "memory": shared_data["memory"]
    })

@app.route("/api/alerts")
def alerts():
    return jsonify(shared_data["alerts"])

@app.route("/api/logs")
def logs():
    return jsonify(shared_data["logs"])

'''
@app.route("/api/attack/cpu", methods=["POST"])
def start_cpu_attack():
    data = request.json

    intensity = int(data.get("intensity", 90))
    duration = int(data.get("duration", 10))
    threads = int(data.get("threads", 1))

    proc = subprocess.Popen([
        "python",
        "simulator/cpu_child.py",
        str(intensity),
        str(duration),
        str(threads)
    ])

    from web.shared_state import attack_pids
    attack_pids["cpu"] = proc.pid

    return {
        "message": f"CPU attack started ({intensity}% for {duration}s, threads={threads})"
    }

@app.route("/api/attack/memory", methods=["POST"])
def start_memory_attack():
    data = request.json

    chunk = int(data.get("chunk", 50))       # MB
    interval = float(data.get("interval", 1))
    duration = int(data.get("duration", 10))

    proc = subprocess.Popen([
        "python",
        "simulator/memory_child.py",
        str(chunk),
        str(interval),
        str(duration)
    ])

    from web.shared_state import attack_pids
    attack_pids["memory"] = proc.pid

    return {
        "message": f"Memory leak started ({chunk}MB every {interval}s for {duration}s)"
    }

@app.route("/api/attack/access", methods=["POST"])
def start_access_attack():
    data = request.json

    rate = int(data.get("rate", 2))           # attempts per second
    total = int(data.get("total", 10))        # total attempts
    delay = float(data.get("delay", 0.1))     # delay between attempts
    vtype = data.get("type", "FILE_ACCESS")   # violation type

    proc = subprocess.Popen([
        "python",
        "simulator/unauthorized_child.py",
        str(rate),
        str(total),
        str(delay),
        vtype
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    from web.shared_state import attack_pids
    attack_pids["access"] = proc.pid

    return {
        "message": f"Unauthorized access attack started ({vtype}, {total} attempts)"
    }
'''

@app.route("/api/attack/stop", methods=["POST"])
def stop_attacks():
    from web.shared_state import attack_pids
    import psutil

    for atk, pid in attack_pids.items():
        if pid:
            try:
                psutil.Process(pid).terminate()
            except:
                pass
            attack_pids[atk] = None

    return {"message": "All attacks stopped"}

@app.route("/api/attack/create", methods=["POST"])
def create_attack():
    data = request.json

    attack_type = data.get("type")
    params = data.get("params", {})

    if not attack_type:
        return {"error": "Attack type required"}, 400

    try:
        proc = launch_attack(attack_type, params)
    except ValueError as e:
        return {"error": str(e)}, 400

    from web.shared_state import attack_pids
    attack_pids[attack_type] = proc.pid

    return {
        "message": f"{attack_type.upper()} attack created",
        "pid": proc.pid
    }

if __name__ == "__main__":
    app.run(debug=True)
