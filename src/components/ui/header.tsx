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
import { LogOut, Menu, PencilLine } from 'lucide-react';
import { useAuth } from '@/hook/useAuth';
import { memo, useEffect, useState } from 'react';
import { Skeleton } from './skeleton';
import { getLiveDataById } from '@/lib/database';
import { usePathname } from 'next/navigation';

interface History {
    role: string;
    parts: { text: string }[];
}

interface ChatType {
   history: History[],
   token: string
}

const Header = memo(({ token = "" }: { token?: string }) => {
    const { user, loading } = useAuth();
    const [history, setHistory] = useState<string[]>([]);
    const url = usePathname();

    useEffect(() => {
        if (!user) return;
        const uid = user.uid;
        const unsub = getLiveDataById(uid, "chats", (chats: ChatType[]) => {
            if(chats.length > 0) {
                const newHistory = chats.map((chat: ChatType) => chat.token);
                setHistory(newHistory);
            };
        });

        return () => unsub && unsub();
    }, [user]);

    return (
        <header className="flex justify-between items-center rounded-md p-2 shadow-md border-slate-400">
            <div className="flex gap-3 items-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="cursor-pointer inline-block lg:hidden"><Menu /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="max-w-[300px] bg-slate-300 overflow-hidden">
                        <SheetHeader>
                            <SheetTitle>Chatbot</SheetTitle>
                        </SheetHeader>

                        <div className="flex-1 overflow-hidden gap-2 px-4 py-2">
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
                        </div>
                        <SheetFooter>
                            <Button className='w-full flex justify-start items-center gap-3 bg-red-600 hover:bg-red-700 cursor-pointer'><LogOut /> Logout</Button>

                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                {loading ? <Skeleton className="w-48 h-6 bg-slate-200" /> : <h1 className="font-bold">{user ? user.displayName : "Anonymous"}</h1>}
            </div>
            {<Jam />}
        </header>
    )
})

Header.displayName = "Header";

export default Header;
