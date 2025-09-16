"use client";

import { Button } from '@/components/ui/button';
import Login from '@/components/ui/login';
import Logout from '@/components/ui/logout';
import { useAuth } from '@/hook/useAuth';
import { getLiveDataById } from '@/lib/database';
import { Loader, PencilLine, SquareArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    const [history, setHistory] = useState<string[]>([]);
    const url = usePathname();

    useEffect(() => {
        if (!user) return;
        const uid = user.uid;
        const unsub = getLiveDataById(uid, "chats", (chats: ChatType[]) => {
            if (chats.length > 0) {
                const newHistory = chats.map((chat: ChatType) => chat.token);
                setHistory(newHistory);
            };
        });

        return () => unsub && unsub();
    }, [user]);

    return (
        <aside className="hidden lg:flex p-3 rounded-md bg-slate-300 shadow-md flex-col h-full overflow-hidden">
            <header className="basis-[6%] flex justify-between items-center border-b-2 border-slate-400 pb-2">
                <h1 className="font-bold">Chatbot</h1>
                <button><SquareArrowRight className='cursor-pointer' /></button>
            </header>
            <section className="basis-[94%] overflow-hidden py-2 space-y-1">
                <Button asChild>
                    <Link className='w-full flex justify-start items-center gap-3 cursor-pointer' href={"/"}>
                        <PencilLine /> Obrolan baru
                    </Link>
                </Button>
                <div className='text-xs text-slate-100 py-4 flex gap-2 items-center'><span className='font-bold bg-slate-950 p-2 rounded-md'>History</span> <hr className='w-full border border-slate-400' /></div>
                <section className='space-y-1 max-h-[430px] py-1 overflow-y-auto'>
                    {history.map((chat: string, index: number) => (
                        <Link key={chat} href={`/c/${chat}`} className={`${url.includes(`/c/${chat}`) ? "bg-slate-400" : ""} text-sm p-2 bg-slate-200 inline-block w-full rounded-md`}>Obrolan {index + 1}</Link>
                    ))}
                </section>
            </section>
            <footer className="basis-[6%] flex justify-between items-center border-t-2 pt-2 border-slate-400">
                {loading ? <Button disabled className='w-full flex justify-center items-center gap-3'>Loading <Loader className='animate-spin' /></Button> : user ? <Logout /> : <Login />}
            </footer>
        </aside>
    )
}

export default Aside
