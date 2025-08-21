import type {State} from '../domain/types';

const KEY = 'habit-tracker/v1';

export function loadState(): State {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {habits: [], entries: []};
    try {
        const parsed = JSON.parse(raw) as State;
        if (!parsed.habits || !parsed.entries) throw new Error('bad');
        return parsed;
    } catch {
        return {habits: [], entries: []};
    }
}

export function saveState(s: State) {
    localStorage.setItem(KEY, JSON.stringify(s));
}

