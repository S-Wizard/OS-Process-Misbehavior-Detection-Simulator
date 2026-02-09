import threading
import time
from detector.anomaly_detector import detect_resource_abuse
from app import create_app

app = create_app()

def run_flask():
    app.run(debug=False, use_reloader=False)

def main():
    print("=== OS Child Process Misbehavior Simulator ===")

    # Start detector
    detector_thread = threading.Thread(
        target=detect_resource_abuse,
        daemon=True
    )
    detector_thread.start()

    print("[MAIN] Detector started.")

    # Start Flask in SAME process
    flask_thread = threading.Thread(
        target=run_flask,
        daemon=True
    )
    flask_thread.start()

    print("[MAIN] Web UI started at http://localhost:5000")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[MAIN] Simulator stopped.")

if __name__ == "__main__":
    main()
