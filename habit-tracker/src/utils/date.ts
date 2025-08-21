export function isSameDay(a: number | Date, b: number | Date): boolean {
    const da = typeof a === "number" ? new Date(a) : a;
    const db = typeof b === "number" ? new Date(b) : b;
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
}