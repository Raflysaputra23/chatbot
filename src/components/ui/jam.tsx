"use client"

import { useEffect, useRef } from "react";

const Jam = () => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const div = divRef.current;
        if (div) {
            const interval = setInterval(() => {
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, "0");
                const minutes = now.getMinutes().toString().padStart(2, "0");
                const seconds = now.getSeconds().toString().padStart(2, "0");
                div.textContent = `${hours}:${minutes}:${seconds}`;

            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    return <div ref={divRef} className="text-sm text-slate-50 bg-slate-950 rounded-md p-1 px-2 w-18 text-center">00:00:00</div>;
}

export default Jam;
