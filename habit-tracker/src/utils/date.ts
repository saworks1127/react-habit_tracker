export function isSameDay(a: number | Date, b: number | Date): boolean {
    const da = typeof a === "number" ? new Date(a) : a;
    const db = typeof b === "number" ? new Date(b) : b;
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
}
// 既存: isSameDay(a,b) はそのまま

export function ymd(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function startOfMonth(d = new Date()): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d = new Date()): Date {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/** 当月のカレンダー行列（週は日曜始まり）。空きは null で埋める */
export function buildMonthMatrix(base = new Date()): (Date | null)[][] {
    const first = startOfMonth(base);
    const last = endOfMonth(base);
    const firstDow = first.getDay(); // 0..6

    const matrix: (Date | null)[][] = [];
    let row: (Date | null)[] = Array(firstDow).fill(null);

    for (let day = 1; day <= last.getDate(); day++) {
        const cur = new Date(first.getFullYear(), first.getMonth(), day);
        row.push(cur);
        if (row.length === 7) {
            matrix.push(row);
            row = [];
        }
    }
    if (row.length > 0) {
        while (row.length < 7) row.push(null);
        matrix.push(row);
    }
    return matrix;
}