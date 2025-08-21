import {useState} from "react";
import type {DayOfWeek, Habit} from "../domain/types";
import {parseHHmm} from "../domain/time";

const days: { v: DayOfWeek; label: string }[] = [
    {v: 0, label: "日"},
    {v: 1, label: "月"},
    {v: 2, label: "火"},
    {v: 3, label: "水"},
    {v: 4, label: "木"},
    {v: 5, label: "金"},
    {v: 6, label: "土"},
];

export default function HabitForm({onSubmit}: { onSubmit: (h: Habit) => void }) {
    const [title, setTitle] = useState("");
    const [sel, setSel] = useState<DayOfWeek[]>([]);
    const [targetTime, setTargetTime] = useState<string>("7:30");
    const [notes, setNotes] = useState("");
    const [err, setErr] = useState<string | null>(null);

    function toggle(day: DayOfWeek) {
        setSel(s => s.includes(day) ? s.filter(d => d !== day) : [...s, day].sort());
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            console.log("targetTime 入力値:", targetTime);
            if (!title.trim()) throw new Error("タイトルを入力してください");
            if(sel.length === 0) throw new Error("曜日を選択してください");
            const t = parseHHmm(targetTime);
            const habit: Habit = {
                id: crypto.randomUUID(),
                title: title.trim(),
                daysOfWeek: sel,
                targetTime: t,
                notes: notes.trim() || undefined,
                createdAt: Date.now(),
            };
            onSubmit(habit);
            setTitle(""); setSel([]); setNotes(""); setErr(null);
        } catch (e: any) {
            setErr(e?.message ?? '入力エラー');
        }
    }
    return (
        <form onSubmit={handleSubmit} style={{ display:"grid", gap:12, margin:"16px 0" }}>
            <label>タイトル
                <input value={title} onChange={e => setTitle(e.target.value)} />
            </label>

            <fieldset style={{ border:"1px solid #ddd", padding:8 }}>
                <legend>曜日</legend>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {days.map(d => (
                        <label key={d.v} style={{ userSelect:"none" }}>
                            <input
                                type="checkbox"
                                checked={sel.includes(d.v)}
                                onChange={() => toggle(d.v)}
                            /> {d.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <label>目標時刻
                <input
                    value={targetTime}
                    onChange={e => setTargetTime(e.target.value)}
                    placeholder="HH:mm（例: 07:30）"
                />
            </label>

            <label>メモ（任意）
                <textarea value={notes} onChange={e => setNotes(e.target.value)} />
            </label>

            {err && <p style={{ color:"crimson" }}>{err}</p>}
            <button type="submit">習慣を追加</button>
        </form>
    );
}