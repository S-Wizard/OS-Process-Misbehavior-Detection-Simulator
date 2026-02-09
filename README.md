# OS Process Misbehavior Simulator

A full-stack application that simulates and detects "misbehaving" processes (CPU spikes, memory leaks, unauthorized access) using Python and React.

## Project Structure
 
 - **backend/**: Python Flask API + Simulator + Detector
     - `app/`: API routes (`routes.py`) and centralized state management (`state.py`).
     - `detector/`: Logic for detecting anomalies (`anomaly_detector.py`) and rules (`rules.py`).
     - `simulator/`: Scripts for generating attack processes (`cpu_child.py`, etc.).
 - **frontend/**: React + Vite Dashboard
     - `src/components/`: Reusable UI components (ProtectionSettings, AttackHistory, etc.).
     - `src/views/`: Main page layouts (Overview, EventLogs).

## Prerequisites

- **Python 3.8+**
- **Node.js 18+**

## Setup & Running

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend starts:
- Flask API at `http://localhost:5000`
- Child Process Monitor (runs in background)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the dashboard at `http://localhost:5173`.

## Features
 
 - **Real-Time Monitoring**: Live visualization of system CPU and Memory usage.
 - **Attack Simulation**:
     - **CPU Stress Test**: Spawns a process that consumes high CPU cycles.
     - **Memory Leak**: Spawns a process that rapidly consumes available RAM.
     - **Unauthorized Access**: Spawns a process attempting illegal file operations.
 - **Automated Protection**:
     - **Anomaly Detection**: Intelligent background monitoring detects resource abuse.
     - **Auto-Termination**: Automatically kills processes exceeding configured thresholds.
 - **Advanced Controls**:
     - **Protection Toggles**: Enable/Disable specific detection modules (CPU, Memory, Access).
     - **Dynamic Thresholds**: Adjust sensitivity levels for detection without restarting.
 - **Logging & History**:
     - **Event Logs**: Detailed log of all system events with export functionality (JSON).
     - **Attack History**: Persistent record of all simulated attacks and their outcomes.
     - **Alerts**: Real-time notifications of detected threats.
