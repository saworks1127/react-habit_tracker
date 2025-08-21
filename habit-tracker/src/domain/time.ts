import type {DayOfWeek, HHmm} from './types';

export function parseHHmm(s: string): HHmm {
    if (!/\d{2}:\d{2}$]/.test(s)) throw new Error('Invalid HHmm');
    const [hh, mm] = s.split(':').map(Number);
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) throw new Error('Invalid HHmm');
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}` as HHmm;
}

export function toMinutes(hhmm: HHmm): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

export function minutesToHHmm(total:number): HHmm {
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` as HHmm;
}

export function todayDow(d = new Date()): DayOfWeek {
    return d.getDay() as DayOfWeek;
}
