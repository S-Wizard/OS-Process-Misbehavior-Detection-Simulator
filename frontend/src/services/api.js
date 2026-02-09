const API_BASE_URL = "http://localhost:5000/api";

export const api = {
    getMetrics: async () => {
        const res = await fetch(`${API_BASE_URL}/metrics`);
        return res.json();
    },

    getLogs: async () => {
        const res = await fetch(`${API_BASE_URL}/logs`);
        return res.json();
    },

    getAlerts: async () => {
        const res = await fetch(`${API_BASE_URL}/alerts`);
        return res.json();
    },

    getStatus: async () => {
        const res = await fetch(`${API_BASE_URL}/status`);
        return res.json();
    },

    createAttack: async (type, params) => {
        const res = await fetch(`${API_BASE_URL}/attack/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, params }),
        });
        return res.json();
    },

    stopAttacks: async () => {
        const res = await fetch(`${API_BASE_URL}/attack/stop`, {
            method: "POST",
        });
        return res.json();
    },

    clearData: async (target = "all") => {
        const res = await fetch(`${API_BASE_URL}/clear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target }),
        });
        return res.json();
    },

    toggleProtection: async (protection) => {
        const res = await fetch(`${API_BASE_URL}/protections/toggle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ protection }),
        });
        return res.json();
    },

    getThresholds: async () => {
        const res = await fetch(`${API_BASE_URL}/thresholds`);
        return res.json();
    },

    updateThreshold: async (key, value) => {
        const res = await fetch(`${API_BASE_URL}/thresholds/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value }),
        });
        return res.json();
    },

    getHistory: async () => {
        const res = await fetch(`${API_BASE_URL}/history`);
        return res.json();
    },
};




