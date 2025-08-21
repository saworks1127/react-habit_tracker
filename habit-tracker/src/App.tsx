import {useEffect, useMemo, useReducer, useState, useCallback} from "react";
import {reducer} from "./state/reducer";
import {loadState} from "./storage/local";
import HabitForm from "./components/HabitForm";
import CalendarGrid from "./components/CalendarGrid";
import type {Habit, Entry} from "./domain/types";
import {isSameDay} from "./utils/date";
import {useHabitAlarm} from "./hooks/useHabitAlarm";
import Toast from "./components/Toast";

function App() {
    const [state, dispatch] = useReducer(reducer, {habits: [], entries: []});
    const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
    useEffect(() => {
        dispatch({type: "INIT", payload: loadState()});
    }, []);
    const pushToast = useCallback((message: string) => {
        const id = crypto.randomUUID();
        setToasts(t => [...t, {id, message}]);
    }, []);
    const popToast = useCallback((id: string) => {
        setToasts(t => t.filter(x => x.id !== id))
    }, []);

    useHabitAlarm(state.habits, (h: Habit) => {
        pushToast(`「${h.title}」の時間です（目標 ${h.targetTime}）`);
    }, 3);

    const checkedTodayMap = useMemo(() => {
        const map = new Map<string, boolean>();
        for (const h of state.habits) {
            const done = state.entries.some(
                (e) => e && e.habitId === h.id && typeof e.checkedAt === "number" && isSameDay(e.checkedAt, Date.now())
            );
            map.set(h.id, done);
        }
        return map;
    }, [state.habits, state.entries]);

    function checkInToday(habit: Habit) {
        const entry: Entry = {
            id: crypto.randomUUID(),
            habitId: habit.id,
            checkedAt: Date.now(),
        };
        dispatch({type: "ADD_ENTRY", payload: entry});
    }

    return (
        <main style={{maxWidth: 720, margin: "24px auto", padding: 16}}>
            <h1>習慣トラッカー（段階4：リマインド通知）</h1>

            <HabitForm onSubmit={(h: Habit) => dispatch({type: "ADD_HABIT", payload: h})}/>

            <h2>習慣一覧</h2>
            <ul style={{display: "grid", gap: 16}}>
                {state.habits.map((h) => {
                    const doneToday = checkedTodayMap.get(h.id) === true;
                    return (
                        <li key={h.id} style={{display: "flex", flexDirection: "column", gap: 8}}>
                            <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                                <div style={{flex: 1}}>
                                    <strong>{h.title}</strong> — {h.targetTime}（{h.daysOfWeek.join(",")}）
                                </div>
                                <button
                                    onClick={() => checkInToday(h)}
                                    disabled={doneToday}
                                    title={doneToday ? "今日は済み" : "今日やった！"}
                                >
                                    {doneToday ? "済み" : "今日やった！"}
                                </button>
                            </div>
                            <CalendarGrid habitId={h.id} entries={state.entries}/>
                        </li>
                    );
                })}
            </ul>

            {/* トースト描画（複数対応） */}
            {toasts.map(t => (
                <Toast key={t.id} message={t.message} onClose={() => popToast(t.id)}/>
            ))}
        </main>
    );
}

export default App;