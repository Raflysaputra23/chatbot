"use client";

import { Button } from '@/components/ui/button';
import Logout from '@/components/ui/logout';
import { useAuth } from '@/hook/useAuth';
import { addData, getLiveDataById } from '@/lib/database';
import { Loader, MessageSquarePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


interface History {
    role: string;
    parts: { text: string }[];
}

interface ChatType {
    history: History[],
    token: string
}

const Aside = () => {
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
            if (chats.length > 0) {
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
            console.error("Gagal menghapus percakapan:", error);
        } finally {
            setDeletingToken(null);
        }
    };

    return (
        <aside className="hidden lg:flex flex-col h-full overflow-hidden"
            style={{
                background: '#13151f',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                width: '260px',
                minWidth: '260px',
            }}>

            {/* Header Sidebar */}
            <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                    <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                    <h1 className="font-bold text-white text-sm">PIKO</h1>
                    <p className="text-xs" style={{ color: '#9aa0a6' }}>AI Asisten Kamu</p>
                </div>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
                <Link href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full"
                    style={{
                        background: 'rgba(79, 142, 247, 0.12)',
                        color: '#4f8ef7',
                        border: '1px solid rgba(79, 142, 247, 0.25)',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(79, 142, 247, 0.2)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(79, 142, 247, 0.12)';
                    }}
                >
                    <MessageSquarePlus size={16} />
                    Obrolan Baru
                </Link>
            </div>

            {/* History Section */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="px-4 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9aa0a6' }}>
                        Riwayat
                    </span>
                </div>
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
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 w-full truncate"
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
                                onMouseEnter={e => {
                                    if (!url.includes(`/dashboard/${chat.token}`)) {
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!url.includes(`/dashboard/${chat.token}`)) {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                    }
                                }}
                            >
                                <span className="truncate pr-6">{chat.firstHistory}</span>
                            </Link>
                            {/* Delete button */}
                            <button
                                onClick={(e) => deleteChat(chat.token, e)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                                style={{ color: '#f45a5a' }}
                                title="Hapus percakapan"
                            >
                                {deletingToken === chat.token
                                    ? <Loader size={14} className="animate-spin" />
                                    : <Trash2 size={14} />
                                }
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {loading
                    ? <Button disabled className='w-full flex justify-center items-center gap-3' style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <Loader size={14} className='animate-spin' /> Memuat...
                    </Button>
                    : <Logout />
                }
            </div>
        </aside>
    );
};

export default Aside;
