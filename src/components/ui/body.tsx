"use client"

import { useAuth } from "@/hook/useAuth";
import { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import { addData, getLiveDataById } from "@/lib/database";
import ChatInput from "./chatInput";
import ChatMessage from "./chatMessage";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw, Sparkles, MessageCircle, Cpu, Heart } from "lucide-react";

interface History {
    role: string;
    parts: { text: string }[];
}

interface ChatType {
    history: History[],
    token: string
}

// =====================
// Loading skeleton
// =====================
const LoadingSkeleton = () => (
    <div className="flex items-start gap-3 px-4 fade-in-up">
        <div className="w-8 h-8 rounded-xl flex-shrink-0 shimmer" />
        <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 rounded-lg shimmer w-3/4" />
            <div className="h-4 rounded-lg shimmer w-1/2" />
            <div className="h-4 rounded-lg shimmer w-5/6" />
        </div>
    </div>
);

// =====================
// Error message
// =====================
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="flex items-start gap-3 px-4 fade-in-up">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(244, 90, 90, 0.15)', border: '1px solid rgba(244, 90, 90, 0.3)' }}>
            <AlertCircle size={16} style={{ color: '#f45a5a' }} />
        </div>
        <div className="flex-1">
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ background: 'rgba(244, 90, 90, 0.08)', border: '1px solid rgba(244, 90, 90, 0.2)' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#f45a5a' }}>PIKO tidak bisa menjawab</p>
                <p className="text-xs" style={{ color: '#9aa0a6' }}>{message}</p>
            </div>
            <button
                onClick={onRetry}
                className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                    background: 'rgba(79, 142, 247, 0.1)',
                    color: '#4f8ef7',
                    border: '1px solid rgba(79, 142, 247, 0.25)',
                }}
            >
                <RefreshCw size={12} /> Coba lagi
            </button>
        </div>
    </div>
);

// =====================
// Welcome screen
// =====================
const WelcomeScreen = ({ onSuggest }: { onSuggest: (text: string) => void }) => {
    const suggestions = [
        { icon: <Cpu size={16} />, label: "Teknologi Terkini", prompt: "Apa saja teknologi AI terbaru di tahun 2025?" },
        { icon: <MessageCircle size={16} />, label: "Konseling", prompt: "Saya sedang stres karena pekerjaan, apa saran kamu?" },
        { icon: <Sparkles size={16} />, label: "Kreativitas", prompt: "Bantu saya membuat ide konten menarik untuk Instagram." },
        { icon: <Heart size={16} />, label: "Kesehatan", prompt: "Bagaimana cara menjaga kesehatan mental sehari-hari?" },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full px-6 py-10 fade-in-up">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 piko-glow"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                <span className="text-white font-bold text-2xl">P</span>
            </div>

            {/* Greeting */}
            <h1 className="text-3xl font-bold mb-2 gradient-text">Hei, Aku PIKO! 👋</h1>
            <p className="text-sm text-center mb-8" style={{ color: '#9aa0a6', maxWidth: '380px' }}>
                Pusat Informasi Konseling dan Obrolan. Aku siap membantu kamu dengan apapun yang kamu butuhkan!
            </p>

            {/* Suggestions */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onSuggest(s.prompt)}
                        className="suggestion-card flex flex-col items-start gap-2 p-4 rounded-2xl text-left"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(79, 142, 247, 0.1)', color: '#4f8ef7' }}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium" style={{ color: '#e8eaed' }}>{s.label}</p>
                            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#9aa0a6' }}>{s.prompt}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// =====================
// Main Body
// =====================
const Body = memo(({ token = "" }: { token?: string }) => {
    const { user, loading } = useAuth();
    const [input, setInput] = useState<string>("");
    const [wait, setWait] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [lastInput, setLastInput] = useState<string>("");
    const [history, setHistory] = useState<ChatType[]>([]);
    const [historyNow, setHistoryNow] = useState<History[]>([]);
    const [url, setUrl] = useState<string>("/dashboard");
    const divRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const isInitializedRef = useRef(false);

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
                    isInitializedRef.current = true;
                } else {
                    // Jika sudah terload sebelumnya → chat dihapus (intentional), silent redirect
                    // Jika belum pernah terload → benar-benar token tidak valid
                    if (!isInitializedRef.current) {
                        // Tunggu sebentar dulu (antisipasi delay Firestore saat pertama load)
                        setTimeout(() => {
                            if (!isInitializedRef.current) {
                                router.push("/dashboard");
                                setUrl("/dashboard");
                            }
                        }, 1500);
                    } else {
                        // Chat dihapus → langsung redirect tanpa alert
                        router.push("/dashboard");
                        setUrl("/dashboard");
                    }
                }
            }
        });

        return () => {
            unsub && unsub();
            isInitializedRef.current = false;
        };
    }, [user, token, router]);

    useEffect(() => {
        if (divRef.current) {
            divRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [historyNow, wait]);

    const send = useCallback(async (teks: string) => {
        if (!user || !teks.trim()) return;
        setWait(true);
        setErrorMsg(null);
        setLastInput(teks);

        const tokenChat = token ? token : crypto.randomUUID();
        const part = { role: "user", parts: [{ text: teks }] };
        const newHistory: History[] = [...historyNow, part];
        const oldHistory: History[] = [...historyNow];

        // Save user message first
        if (history.length > 0) {
            const nowData = history.filter((d: ChatType) => d.token === tokenChat);
            if (nowData.length > 0) {
                nowData[0].history = newHistory;
                await addData("chats", { chats: history }, user.uid);
            } else {
                const newData: ChatType = { history: newHistory, token: tokenChat };
                history.push(newData);
                await addData("chats", { chats: history }, user.uid);
            }
        } else {
            await addData("chats", { chats: [{ history: newHistory, token: tokenChat }] }, user.uid);
        }

        const uid = await user.tokenId;
        const response = await fetch(`/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${uid}`
            },
            body: JSON.stringify({ message: teks, oldHistory, history, newHistory, tokenChat })
        });

        const data = await response.json();
        if (data.status) {
            if (url === "/dashboard") router.push(`/dashboard/${tokenChat}`);
        } else {
            setErrorMsg(data.message || "Bot tidak merespon, coba lagi!");
        }

        setInput("");
        setWait(false);
    }, [input, history, user, token, historyNow, router, url]);

    const handleSuggest = (text: string) => {
        setInput(text);
        send(text);
    };

    const handleRetry = () => {
        if (lastInput) send(lastInput);
    };

    return (
        <>
            {/* Chat area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden py-6 flex flex-col gap-6">
                {loading ? (
                    <div className="flex flex-col gap-6 mt-4">
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </div>
                ) : historyNow.length > 0 ? (
                    <>
                        {historyNow.map((part, index: number) => (
                            <Fragment key={index}>
                                <ChatMessage
                                    part={part}
                                    isLast={index === historyNow.length - 1}
                                    divRef={divRef}
                                />
                            </Fragment>
                        ))}
                        {wait && (
                            <div ref={divRef}>
                                <LoadingSkeleton />
                            </div>
                        )}
                        {errorMsg && !wait && (
                            <ErrorMessage message={errorMsg} onRetry={handleRetry} />
                        )}
                    </>
                ) : (
                    <WelcomeScreen onSuggest={handleSuggest} />
                )}
            </main>

            {/* Footer input */}
            <footer className="pb-4 pt-2 px-4">
                <ChatInput input={input} setInput={setInput} send={send} wait={wait} />
            </footer>
        </>
    );
})

Body.displayName = "Body";

export default Body;
