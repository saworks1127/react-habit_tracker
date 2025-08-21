import { useEffect, useReducer } from "react";
import { reducer } from "./state/reducer";
import { loadState } from "./storage/local";
import type { Habit } from "./domain/types";

function App() {
    const [state, dispatch] = useReducer(reducer, { habits: [], entries: [] });
    useEffect(() => {
        dispatch({type: 'INIT', payload: loadState()});
    }, []);

    return (
        <main style={{maxWidth: 720, margin: "24px auto", padding: 16}}>
            <h1>習慣トラッカー（Lv2 / 段階1）</h1>
            <p>習慣数: {state.habits.length}</p>
            <ul>
                {state.habits.map((h: Habit) => (
                    <li key={h.id}>
                        <strong>{h.title}</strong> - {h.targetTime}
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default App;