import {useEffect, useReducer, useMemo} from "react";
import {reducer} from "./state/reducer";
import {loadState} from "./storage/local";
import HabitForm from "./components/HabitForm";
import type {Habit, Entry} from "./domain/types";
import {isSameDay} from "./utils/date";

function App() {
    const [state, dispatch] = useReducer(reducer, {habits: [], entries: []});

    useEffect(() => {
        dispatch({type: "INIT", payload: loadState()});
    }, []);

    const checkedTodayMap = useMemo(() => {
        const map = new Map<string, boolean>();
        for (const h of state.habits) {
            const done = state.entries.some(
                (e) => e.habitId === h.id && isSameDay(e.createdAt, Date.now()));
            map.set(h.id, done);
        }
        return map;
    }, [state.habits, state.entries]);

    function checkInToday(habit: Habit) {
        const entry: Entry = {
            id: crypto.randomUUID(),
            habitId: habit.id,
            createdAt: Date.now(),
        };
        dispatch({type: "ADD_ENTRY", payload: entry});
    }
    return (
        <main style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
            <h1>習慣トラッカー（段階3：チェックインのBabyStep）</h1>

            <HabitForm onSubmit={(h: Habit) =>
                dispatch({ type: "ADD_HABIT", payload: h })
            } />

            <h2>習慣一覧</h2>
            <ul style={{ display:"grid", gap:12 }}>
                {state.habits.map((h) => {
                    const doneToday = checkedTodayMap.get(h.id) === true;
                    return (
                        <li key={h.id} style={{ display:"flex", gap:12, alignItems:"center" }}>
                            <div style={{ flex:1 }}>
                                <strong>{h.title}</strong> — {h.targetTime}（{h.daysOfWeek.join(",")}）
                            </div>
                            <button
                                onClick={() => checkInToday(h)}
                                disabled={doneToday}
                                title={doneToday ? "今日は済み" : "今日やった！"}
                            >
                                {doneToday ? "済み" : "今日やった！"}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <p style={{opacity:0.7, marginTop:12}}>
                習慣数: {state.habits.length} / 今日の達成: {
                state.habits.filter(h => checkedTodayMap.get(h.id)).length
            }
            </p>
        </main>
    );
}
export default App;