export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type HHmm = `${number}${number}:${number}${number}`;

export interface Habit {
    id: string;
    title: string;
    daysOfWeek: DayOfWeek[];
    targetTime: HHmm;
    notes?: string;
    createdAt: number;
}

export interface Entry {
    id: string;
    habitId: string;
    createdAt: number;
}
export interface State {
    habits: Habit[];
    entries: Entry[];
}
