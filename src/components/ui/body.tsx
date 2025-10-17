"use client"

import { useAuth } from "@/hook/useAuth";
import { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import { addData, getLiveDataById } from "@/lib/database";
import ChatInput from "./chatInput";
import ChatMessage from "./chatMessage";
import { Loader, Loader2 } from "lucide-react";
import { MixinAlert } from "@/lib/alert";
import { useRouter } from "next/navigation";
import { Button } from "./button";

interface History {
    role: string;
    parts: { text: string }[];
}

interface ChatType {
    history: History[],
    token: string
}

const Body = memo(({ token = "" }: { token?: string }) => {
    const { user, loading } = useAuth();
    const [input, setInput] = useState<string>("");
    const [wait, setWait] = useState<boolean>(false);
    const [history, setHistory] = useState<ChatType[]>([]);
    const [historyNow, setHistoryNow] = useState<History[]>([]);
    const [url, setUrl] = useState<string>("/dashboard");
    const divRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        const uid = user.uid;
        const unsub = getLiveDataById(uid, "chats", (chats: ChatType[]) => {
            setHistory(chats);
            if (token) {
                const nowData = chats.filter((data: ChatType) => data.token === token);
                if (nowData.length > 0) {
                    setHistoryNow(nowData[0].history);
                    setUrl(`/dashboard/${nowData[0].token}`);
                } else {
                    MixinAlert("error", `Token ${token} Invalid!`);
                    router.push("/dashboard");
                    setUrl("/dashboard");
                }
            }
        });

        return () => unsub && unsub();
    }, [user, token, router]);

    useEffect(() => {
        const div = divRef.current;
        if (div) {
            div.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [history]);

    const send = useCallback(async (teks: string) => {
        if (user) {
            setWait(true);
            const tokenChat = token ? token : await crypto.randomUUID()
            const part = { role: "user", parts: [{ text: teks }] };
            const newHistory: History[] = historyNow;
            newHistory.push(part);
            const oldHistory: History[] = historyNow;

            if (history.length > 0) {
                const nowData = history.filter((data: ChatType) => data.token === tokenChat);
                if (nowData.length > 0) {
                    nowData[0].history = newHistory;
                    await addData("chats", { chats: history }, user.uid);
                } else {
                    const newData: ChatType = { history: newHistory, token: tokenChat };
                    history.push(newData);
                    await addData("chats", { chats: history }, user.uid);
                }
            } else {
                const newData: ChatType = { history: newHistory, token: tokenChat };
                await addData("chats", { chats: [newData] }, user.uid);
            }

            const uid = await user.tokenId;
            const response = await fetch(`/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${uid}`
                },
                body: JSON.stringify({
                    message: input,
                    oldHistory,
                    history,
                    newHistory,
                    tokenChat
                })
            });
            const data = await response.json();
            if (data.status) {
                if (url === "/dashboard") router.push(`/dashboard/${tokenChat}`);
            } else {
                MixinAlert("error", "Bot tidak merespon, coba lagi!");
            }
            setInput("");
            setWait(false);
        }
    }, [input, history, user, token, historyNow, router, url]);

    const handleInput = (teks: string) => {
        setInput(teks);
        send(teks);
    }


    return (
        <>
            <main className="flex-1 py-2 flex flex-col overflow-y-auto overscroll-auto gap-10 overflow-x-hidden">
                {loading ? <div className="m-auto flex flex-col items-center gap-3">
                    <Loader size={50} className="animate-spin" />
                    <span className="text-xl">Inisialisasi Data</span>
                </div> : historyNow.length > 0 ? historyNow.map((part, index: number) =>
                    <Fragment key={index}>
                        <ChatMessage part={part} isLast={index === historyNow.length - 1} divRef={divRef} />
                        {(index === historyNow.length - 1) && wait && <p ref={(index === historyNow.length - 1) ? divRef : null} className="flex items-center gap-2 font-semibold">Sedang mengetik <Loader2 size={20} className="animate-spin" /></p>}
                    </Fragment>
                ) : <div className="m-auto flex flex-col items-center relative">
                    <span className="text-2xl font-bold text-center">Apa yang ingin kamu tanyakan?</span>
                    <div className="w-full flex justify-center flex-wrap gap-3 overflow-hidden absolute top-20">
                        <Button onClick={() => handleInput("Teknologi itu apa dan, teknologi terbaru apa saja?")} className="cursor-pointer bg-transparent border border-black text-black hover:text-white">Teknologi</Button>
                        <Button onClick={() => handleInput("Apa itu bisnis?, apa saja bisnis terbaru?")} className="cursor-pointer bg-transparent border border-black text-black hover:text-white active:bg-black active:text-white">Bisnis</Button>
                        <Button onClick={() => handleInput("Apa itu ilmu pengetahuan, apa saja ilmu pengetahuan terbaru?")} className="cursor-pointer bg-transparent border border-black text-black hover:text-white active:bg-black active:text-white">Scients</Button>
                        <Button onClick={() => handleInput("Apa itu pemrograman, apa saja bahasa pemrograman terbaru?")} className="cursor-pointer bg-transparent border border-black text-black hover:text-white active:bg-black active:text-white">Bahasa Pemrograman</Button>
                    </div>
                </div>}
            </main>
            <footer className="rounded-md flex justify-between items-center gap-2 pt-2">
                <ChatInput input={input} setInput={setInput} send={send} wait={wait} />
            </footer>
        </>
    )
})

Body.displayName = "Body";

export default Body;
