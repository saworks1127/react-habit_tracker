import type {State, Habit, Entry} from "../domain/types";
import {saveState} from "../storage/local";

export type Action =
    | { type: 'INIT'; payload: State }
    | { type: 'ADD_HABIT'; payload: Habit }
    | { type: 'ADD_ENTRY'; payload: Entry };

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'INIT': return action.payload;
        case "ADD_HABIT": {
            const next = { ...state, habits: [...state.habits, action.payload] };
            saveState(next);
            return next;
        }
        case "ADD_ENTRY": {
            const next = { ...state, entries: [action.payload, ...state.entries] };
            saveState(next);
            return next;
        }
        default: return state;
    }
}