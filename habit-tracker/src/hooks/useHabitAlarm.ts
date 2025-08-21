import {useEffect, useRef} from "react";
import type {Habit} from "../domain/types";
import {nextOccurrence} from "../logic/nextOccurrence";

export function useHabitAlarm(
    habits: Habit[],
    onFire: (habit: Habit) => void,
    windowMinuts = 3
) {
    const timeoutRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const nextRef = useRef<{ habitId: string; at: number } | null>(null);
    const lastCheckRef = useRef<number>(0);

    useEffect(() => {
        schedue();
        startRefWatch();
        return () => {
            clearTimer();
            stopRef();
        };
    }, [JSON.stringify(habits)]);

    function clearTimer() {
        if (timeoutRef.current != null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }

    function stopRef() {
        if (rafRef.current != null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }

    function schedue() {
        clearTimer();
        nextRef.current = null;
        if (!habits || habits.length === 0) return;

        const canditates = habits.map(h => ({h, at: nextOccurrence(h).getTime()}));
        canditates.sort((a, b) => a.at - b.at);
        const first = canditates[0];

        nextRef.current = {habitId: first.h.id, at: first.at};
        const delay = Math.max(0, first.at - Date.now());
        timeoutRef.current = window.setTimeout(() => {
            const within = Math.abs(Date.now() - first.at) <= windowMinuts * 60_000;
            if (within) onFire(first.h);
            schedue();
        }, delay);
    }

    function startRefWatch() {
        const tick = () => {
            rafRef.current = requestAnimationFrame(tick);

            const now = performance.now();
            if (now - lastCheckRef.current > 120_000) return;
            lastCheckRef.current = now;

            const next = nextRef.current;
            if(!next) return;

            const driftAbs = Math.abs(next.at - Date.now());
            if (driftAbs > 5 * 60_000) {
                schedue();
            }
        };
        tick();
    }
}