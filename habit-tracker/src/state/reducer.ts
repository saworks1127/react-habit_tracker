import type {State, Habit, Entry} from "../domain/types";
import {saveState} from "../storage/local";
import {isSameDay} from "../utils/date"; // ★追加

export type Action =
    | { type: "INIT"; payload: State }
    | { type: "ADD_HABIT"; payload: Habit }
    | { type: "ADD_ENTRY"; payload: Entry };

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "INIT":
            return action.payload;
        case "ADD_HABIT": {
            const next = {...state, habits: [...state.habits, action.payload]};
            saveState(next);
            return next;
        }
        case "ADD_ENTRY": {
            const e = action.payload;
            const already = state.entries.some(
                (x) => x.habitId === e.habitId && isSameDay(x.createdAt, e.createdAt)
            );
            if (already) return state;
            const next = {...state, entries: [e, ...state.entries]};
            saveState(next);
            return next;
        }
        default:
            return state;
    }
}