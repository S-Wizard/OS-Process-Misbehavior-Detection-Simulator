import threading
import time
from detector.child_detector import monitor_child_process
from web.app import app  # Flask app

def run_flask():
    app.run(debug=False, use_reloader=False)

def main():
    print("=== OS Child Process Misbehavior Simulator ===")

    # Start detector
    detector_thread = threading.Thread(
        target=monitor_child_process,
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
