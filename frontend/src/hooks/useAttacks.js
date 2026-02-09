import { useState } from "react";
import { api } from "../services/api";

export function useAttacks() {
    const [loading, setLoading] = useState(false);

    const launchAttack = async (type, params) => {
        setLoading(true);
        try {
            const res = await api.createAttack(type, params);
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const stopAllAttacks = async () => {
        setLoading(true);
        try {
            await api.stopAttacks();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { launchAttack, stopAllAttacks, loading };
}
