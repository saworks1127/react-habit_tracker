import type {Habit, DayOfWeek} from "../domain/types";
import {toMinutes} from "../domain/time";

export function nextOccurrence(h: Habit, base = new Date()): Date {
    const now = new Date(base);
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const targetMin = toMinutes(h.targetTime);
    const todayDow = now.getDay() as DayOfWeek;

    const setHM = (d: Date, totalMin: number) => {
        d.setHours(Math.floor(totalMin / 60), totalMin % 60, 0, 0);
        return d;
    };

    if (h.daysOfWeek.includes(todayDow) && targetMin > nowMin) {
        return setHM(new Date(now), targetMin);
    }

    for (let add = 1; add <= 7; add++) {
        const d = new Date(now);
        d.setDate(d.getDate() + add);
        const dow = d.getDay() as DayOfWeek;
        if (h.daysOfWeek.includes(dow)) {
            return setHM(d, targetMin);
        }
    }
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 来週同じ時間
}