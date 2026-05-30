/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Jam from './jam';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";
import { Button } from './button';
import { Loader, Menu, MessageSquarePlus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hook/useAuth';
import { memo, useEffect, useState } from 'react';
import { getLiveDataById, addData } from '@/lib/database';
import { usePathname, useRouter } from 'next/navigation';
import Logout from './logout';

interface History {
    role: string;
    parts: { text: string }[];
}

interface ChatType {
   history: History[],
   token: string
}

const Header = memo(() => {
    const { user, loading } = useAuth();
    const [history, setHistory] = useState<{token: string, firstHistory: string}[]>([]);
    const [allChats, setAllChats] = useState<ChatType[]>([]);
    const [deletingToken, setDeletingToken] = useState<string | null>(null);
    const url = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        const uid = user.uid;
        const unsub = getLiveDataById(uid, "chats", (chats: ChatType[]) => {
            setAllChats(chats);
            if(chats.length > 0) {
                const newHistory = chats.map((chat: ChatType) => ({
                    token: chat.token,
                    firstHistory: chat.history[0].parts[0].text
                })).reverse();
                setHistory(newHistory);
            } else {
                setHistory([]);
            }
        });

        return () => unsub && unsub();
    }, [user]);

    const deleteChat = async (token: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return;
        setDeletingToken(token);
        try {
            const filtered = allChats.filter((chat: ChatType) => chat.token !== token);
            await addData("chats", { chats: filtered }, user.uid);
            if (url.includes(`/dashboard/${token}`)) {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Gagal menghapus:", error);
        } finally {
            setDeletingToken(null);
        }
    };

    return (
        <header
            className="flex justify-between items-center px-4 py-3"
            style={{
                background: 'rgba(19,21,31,0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Left: Mobile menu + Brand */}
            <div className="flex gap-3 items-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            className="inline-flex lg:hidden items-center justify-center w-9 h-9 rounded-xl transition-colors"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#e8eaed' }}
                        >
                            <Menu size={18} />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="max-w-[280px] p-0 overflow-hidden"
                        style={{ background: '#13151f', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <SheetHeader className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                                    <span className="text-white font-bold text-sm">P</span>
                                </div>
                                <SheetTitle className="text-white font-bold">PIKO</SheetTitle>
                            </div>
                        </SheetHeader>

                        <div className="flex flex-col h-[calc(100%-60px)] overflow-hidden">
                            {/* New Chat */}
                            <div className="p-3">
                                <Link href="/dashboard"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full"
                                    style={{
                                        background: 'rgba(79, 142, 247, 0.12)',
                                        color: '#4f8ef7',
                                        border: '1px solid rgba(79, 142, 247, 0.25)',
                                    }}
                                >
                                    <MessageSquarePlus size={16} />
                                    Obrolan Baru
                                </Link>
                            </div>

                            {/* History label */}
                            <div className="px-4 py-1">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9aa0a6' }}>
                                    Riwayat
                                </span>
                            </div>

                            {/* History list */}
                            <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-2">
                                {history.length === 0 && !loading && (
                                    <p className="text-xs px-2 py-4 text-center" style={{ color: '#9aa0a6' }}>
                                        Belum ada percakapan
                                    </p>
                                )}
                                {history.map((chat) => (
                                    <div key={chat.token} className="relative group">
                                        <Link
                                            href={`/dashboard/${chat.token}`}
                                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 w-full"
                                            style={{
                                                background: url.includes(`/dashboard/${chat.token}`)
                                                    ? 'rgba(79, 142, 247, 0.15)'
                                                    : 'transparent',
                                                color: url.includes(`/dashboard/${chat.token}`)
                                                    ? '#4f8ef7'
                                                    : '#c8cdd6',
                                                border: url.includes(`/dashboard/${chat.token}`)
                                                    ? '1px solid rgba(79, 142, 247, 0.25)'
                                                    : '1px solid transparent',
                                            }}
                                        >
                                            <span className="truncate pr-6">{chat.firstHistory}</span>
                                        </Link>
                                        <button
                                            onClick={(e) => deleteChat(chat.token, e)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                                            style={{ color: '#f45a5a' }}
                                            title="Hapus"
                                        >
                                            {deletingToken === chat.token
                                                ? <Loader size={13} className="animate-spin" />
                                                : <Trash2 size={13} />
                                            }
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <SheetFooter className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <Logout />
                            </SheetFooter>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Brand */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center hidden lg:flex"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                        <span className="text-white font-bold text-xs">P</span>
                    </div>
                    {loading
                        ? <div className="w-32 h-5 rounded shimmer" />
                        : <div>
                            <span className="font-semibold text-sm gradient-text">PIKO</span>
                            {user && <span className="text-xs ml-2" style={{ color: '#9aa0a6' }}>halo, {user.username}! 👋</span>}
                        </div>
                    }
                </div>
            </div>

            {/* Right: Clock */}
            <Jam />
        </header>
    )
})

Header.displayName = "Header";

export default Header;
