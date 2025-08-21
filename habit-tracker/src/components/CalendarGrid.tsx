import type {Entry} from "../domain/types";
import {buildMonthMatrix, ymd} from "../utils/date";
import {useMemo} from "react";

const WD = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarGrid({
                                         habitId,
                                         entries,
                                         base = new Date(),
                                     }: {
    habitId: string;
    entries: Entry[];
    base?: Date;
}) {
    const hitSet = useMemo(() => {
        const set = new Set<string>();
        const m = base.getMonth();
        const y = base.getFullYear();
        for (const e of entries) {
            if (e.habitId !== habitId) continue;
            const d = new Date(e.checkedAt);
            if (d.getFullYear() === y && d.getMonth() === m) {
                set.add(ymd(d));
            }
        }
        return set;
    }, [habitId, entries, base]);

    const matrix = buildMonthMatrix(base);
    return (
        <div style={{border: "1px solid #e5e7eb", borderRadius: 8, padding: 8}}>
            {/* ヘッダ（曜日） */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    fontSize: 12,
                    color: "#6b7280",
                    marginBottom: 4,
                    textAlign: "center",
                }}
            >
                {WD.map(w => <div key={w}>{w}</div>)}
            </div>

            {/* 本体 */}
            <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4}}>
                {matrix.flatMap((row, ri) =>
                    row.map((d, ci) => {
                        if (!d) {
                            return (
                                <div key={`${ri}-${ci}`}
                                     style={{aspectRatio: "1/1", background: "#f9fafb", borderRadius: 6}}/>
                            );
                        }
                        const key = ymd(d);
                        const hit = hitSet.has(key);
                        return (
                            <div
                                key={key}
                                style={{
                                    aspectRatio: "1/1",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 14,
                                    background: hit ? "#e0f2fe" : "white",
                                    fontWeight: hit ? 700 : 400,
                                }}
                                title={hit ? "達成" : "未達"}
                            >
                                {d.getDate()}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}