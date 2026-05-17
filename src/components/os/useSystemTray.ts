import { useEffect, useState } from 'react';

interface BatteryManager extends EventTarget {
    level: number;
    charging: boolean;
}

interface NavigatorWithBattery extends Navigator {
    getBattery?: () => Promise<BatteryManager>;
}

export interface SystemTrayState {
    online: boolean;
    batteryLevel: number | null;
    charging: boolean;
    hasBattery: boolean;
}

/**
 * Real-time browser system tray data:
 *  - `online` from `navigator.onLine` + online/offline events
 *  - `batteryLevel` and `charging` from the (Chrome-only) Battery API.
 *  - `hasBattery` is false when the API is unavailable (Firefox/Safari).
 */
export const useSystemTray = (): SystemTrayState => {
    const [online, setOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [charging, setCharging] = useState(false);
    const [hasBattery, setHasBattery] = useState(false);

    useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    useEffect(() => {
        const nav = navigator as NavigatorWithBattery;
        if (!nav.getBattery) return;

        let battery: BatteryManager | null = null;
        let cancelled = false;

        const sync = (b: BatteryManager) => {
            setBatteryLevel(b.level);
            setCharging(b.charging);
        };

        nav.getBattery().then(b => {
            if (cancelled) return;
            battery = b;
            setHasBattery(true);
            sync(b);
            b.addEventListener('levelchange', () => sync(b));
            b.addEventListener('chargingchange', () => sync(b));
        }).catch(() => {
            /* API present but rejected — Firefox sometimes does this */
        });

        return () => {
            cancelled = true;
            if (battery) {
                battery.removeEventListener('levelchange', () => sync(battery!));
                battery.removeEventListener('chargingchange', () => sync(battery!));
            }
        };
    }, []);

    return { online, batteryLevel, charging, hasBattery };
};
