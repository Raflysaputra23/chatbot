"use client"

import { useAuth } from "@/hook/useAuth";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { addData, getLiveDataById } from "@/lib/database";
import ChatInput from "./chatInput";
import ChatMessage from "./chatMessage";
import { Loader } from "lucide-react";
import { MixinAlert } from "@/lib/alert";
import { useRouter } from "next/navigation";

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
    const [url, setUrl] = useState<string>("/");
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

    const send = useCallback(async () => {
        if (user) {
            setWait(true);
            const tokenChat = token ? token : await crypto.randomUUID()
            const part = { role: "user", parts: [{ text: input }] };
            const newHistory: History[] = historyNow;
            newHistory.push(part);
            const oldHistory: History[] = historyNow;
            
            if (history.length > 0) {
                const nowData = history.filter((data: ChatType) => data.token === tokenChat);
                if(nowData.length > 0) {
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
            if(data) {
                if(url === "/dashboard") router.push(`/dashboard/${tokenChat}`);
            }
            setInput("");
            setWait(false);
        }
    }, [input, history, user, token, historyNow, router, url]);


    return (
        <>
            <main className="flex-1 py-2 flex flex-col overflow-y-auto gap-10 overflow-x-hidden">
                {loading ? <div className="m-auto flex flex-col items-center gap-3">
                    <Loader size={50} className="animate-spin" />
                    <span className="text-xl">Inisialisasi Data</span>
                </div> : historyNow.length > 0 ? historyNow.map((part, index: number) =>
                    <ChatMessage key={index} part={part} isLast={index === historyNow.length - 1} divRef={divRef} />
                ) : <div className="m-auto flex flex-col items-center gap-3">
                    <span className="text-2xl font-bold text-center">Apa yang ingin kamu tanyakan?</span>
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
