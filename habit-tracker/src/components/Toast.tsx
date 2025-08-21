import {useEffect} from "react";

export default function Toast({
                                  message,
                                  onClose,
                                  ms = 4000,
                              }: { message: string; onClose: () => coid; ms?: number }) {
    useEffect(() => {
        const id = setTimeout(onClose, ms);
        return () => clearTimeout(id);
    }, [onClose, ms]);

    return (
        <div style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            background: "rgba(15,23,42,0.92)",
            color: "white",
            padding: "12px 14px",
            borderRadius: 12,
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
            zIndex: 50,
            maxWidth: 320,
            lineHeight: 1.4
        }}>
            {message}
        </div>
    );
}