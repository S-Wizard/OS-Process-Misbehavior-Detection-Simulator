from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import psutil

from simulator.attack_dispatcher import launch_attack
from web.shared_state import shared_data, attack_pids

app = Flask(__name__)
CORS(app)

# -------------------------
# METRICS & MONITORING APIs
# -------------------------

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


# -------------------------
# ATTACK CONTROL APIs
# -------------------------

@app.route("/api/attack/create", methods=["POST"])
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
    attack_pids[attack_type] = proc.pid

    # -------------------------
    # ATTACK TIMELINE MARKER
    # -------------------------
    marker = f"[ATTACK_START] {attack_type.upper()} PID={proc.pid}"
    shared_data["logs"].append(marker)

    # Attack-specific logs (AFTER marker)
    shared_data["logs"].append(
        f"[INFO] {attack_type.upper()} process created (PID {proc.pid})"
    )

    # Trim log size
    shared_data["logs"] = shared_data["logs"][-50:]

    return {
        "message": f"{attack_type.upper()} attack created",
        "pid": proc.pid,
        "marker": marker
    }


@app.route("/api/attack/stop", methods=["POST"])
def stop_attacks():
    for atk, pid in attack_pids.items():
        if pid:
            try:
                psutil.Process(pid).terminate()
                shared_data["logs"].append(
                    f"[ACTION] Attack process {atk.upper()} (PID {pid}) terminated"
                )
            except Exception:
                pass

            attack_pids[atk] = None

    shared_data["logs"].append(
        "[STATUS] System stabilized after stopping attacks"
    )

    shared_data["logs"] = shared_data["logs"][-50:]

    return {"message": "All attacks stopped"}


# -------------------------
# MAIN ENTRY POINT
# -------------------------

if __name__ == "__main__":
    app.run(debug=True)
