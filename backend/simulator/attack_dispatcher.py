import subprocess

def launch_attack(attack_type, params):
    if attack_type == "cpu":
        intensity = params.get("intensity", 90)
        duration = params.get("duration", 10)
        threads = params.get("threads", 1)

        return subprocess.Popen([
            "python",
            "simulator/cpu_child.py",
            str(intensity),
            str(duration),
            str(threads)
        ])

    elif attack_type == "memory":
        chunk = params.get("chunk", 50)
        interval = params.get("interval", 1)
        duration = params.get("duration", 10)

        return subprocess.Popen([
            "python",
            "simulator/memory_child.py",
            str(chunk),
            str(interval),
            str(duration)
        ])

    elif attack_type == "access":
        rate = params.get("rate", 2)
        total = params.get("total", 10)
        delay = params.get("delay", 0.1)
        violation = params.get("violation", "FILE_ACCESS")

        return subprocess.Popen([
            "python",
            "simulator/unauthorized_child.py",
            str(rate),
            str(total),
            str(delay),
            violation
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    else:
        raise ValueError("Unknown attack type")
