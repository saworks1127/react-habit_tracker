import { useEffect, useReducer } from "react";
import { reducer } from "./state/reducer";
import { loadState } from "./storage/local";
import HabitForm from "./components/HabitForm";
import type { Habit } from "./domain/types";

function App() {
    const [state, dispatch] = useReducer(reducer, {habits: [], entries: []});
    useEffect(() => {
        dispatch({type: "INIT", payload: loadState()});
    }, []);
    return (
        <main style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
            <h1>習慣トラッカー（段階2）</h1>

            <HabitForm onSubmit={(h: Habit) =>
                dispatch({ type: "ADD_HABIT", payload: h })
            } />

            <h2>習慣一覧</h2>
            <ul>
                {state.habits.map(h => (
                    <li key={h.id}>
                        <strong>{h.title}</strong> — {h.targetTime}（{h.daysOfWeek.join(",")}）
                        {h.notes ? ` / ${h.notes}` : ""}
                    </li>
                ))}
            </ul>
            <p style={{opacity:0.7}}>習慣数: {state.habits.length}</p>
        </main>
    );
}

export default App;