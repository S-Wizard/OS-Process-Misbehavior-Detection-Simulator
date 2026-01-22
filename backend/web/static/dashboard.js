const cpuCtx = document.getElementById("cpuChart").getContext("2d");
const memCtx = document.getElementById("memoryChart").getContext("2d");

/* ================= CPU CHART ================= */
const cpuChart = new Chart(cpuCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "CPU Usage (per core %)",
            data: [],
            borderColor: "#22d3ee",
            tension: 0.3,
            fill: false
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

/* ================= MEMORY CHART ================= */
const memoryChart = new Chart(memCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Memory Usage (MB)",
            data: [],
            borderColor: "#a78bfa",
            tension: 0.3,
            fill: false
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

/* ================= DASHBOARD UPDATE ================= */
async function updateDashboard() {
    const metrics = await fetch("/api/metrics").then(r => r.json());
    const alerts = await fetch("/api/alerts").then(r => r.json());
    const logs = await fetch("/api/logs").then(r => r.json());

    /* ---- CPU Chart ---- */
    cpuChart.data.labels.push("");
    if (cpuChart.data.labels.length > metrics.cpu.length) {
        cpuChart.data.labels.shift();
    }
    cpuChart.data.datasets[0].data = metrics.cpu;
    cpuChart.update();

    /* ---- Memory Chart ---- */
    memoryChart.data.labels.push("");
    if (memoryChart.data.labels.length > metrics.memory.length) {
        memoryChart.data.labels.shift();
    }
    memoryChart.data.datasets[0].data = metrics.memory;
    memoryChart.update();

    /* ---- Alerts ---- */
    const alertList = document.getElementById("alerts");
    alertList.innerHTML = "";
    alerts.forEach(a => {
        const li = document.createElement("li");
        li.textContent = a;
        alertList.appendChild(li);
    });

    /* ---- Logs ---- */
    const logList = document.getElementById("logs");
    logList.innerHTML = "";
    logs.forEach(l => {
        const li = document.createElement("li");
        li.textContent = l;
        logList.appendChild(li);
    });
}

/* ================= ATTACK CONTROLS ================= */
setInterval(updateDashboard, 1000);

async function startAttack(type) {
    const res = await fetch(`/api/attack/${type}`, {
        method: "POST"
    });
    const data = await res.json();
    alert(data.message);
}

async function stopAttacks() {
    const res = await fetch("/api/attack/stop", {
        method: "POST"
    });
    const data = await res.json();
    alert(data.message);
}

async function startCpuAttack() {
    const intensity = document.getElementById("cpuIntensity").value;
    const duration = document.getElementById("cpuDuration").value;
    const threads = document.getElementById("cpuThreads").value;

    const data = await createAttack("cpu", {
        intensity: intensity,
        duration: duration,
        threads: threads
    });

    alert(data.message);
}

async function startMemoryAttack() {
    const chunk = document.getElementById("memChunk").value;
    const interval = document.getElementById("memInterval").value;
    const duration = document.getElementById("memDuration").value;

    const data = await createAttack("memory", {
        chunk: chunk,
        interval: interval,
        duration: duration
    });

    alert(data.message);
}


async function startMemoryAttack() {
    const chunk = document.getElementById("memChunk").value;
    const interval = document.getElementById("memInterval").value;
    const duration = document.getElementById("memDuration").value;

    const data = await createAttack("memory", {
        chunk: chunk,
        interval: interval,
        duration: duration
    });

    alert(data.message);
}


async function createAttack(type, params) {
    const res = await fetch("/api/attack/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: type,
            params: params
        })
    });

    return await res.json();
}


