"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut } from 'lucide-react';
import { MixinAlert } from '@/lib/alert';
import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
    const auth = getAuth();

    const logout = async () => {
        try {
            await signOut(auth);
            MixinAlert("success"    , "Sampai jumpa! 👋");
        } catch (error) {
            console.error(error);
            MixinAlert("error", "Logout gagal, coba lagi!");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                        background: 'rgba(244, 90, 90, 0.08)',
                        color: '#f45a5a',
                        border: '1px solid rgba(244, 90, 90, 0.2)',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(244, 90, 90, 0.15)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(244, 90, 90, 0.08)';
                    }}
                >
                    <LogOut size={16} />
                    Keluar
                </button>
            </DialogTrigger>
            <DialogContent style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)' }}>
                <DialogHeader>
                    <DialogTitle className='text-white'>Keluar dari PIKO?</DialogTitle>
                    <DialogDescription style={{ color: '#9aa0a6' }}>
                        Kamu yakin ingin keluar? Percakapanmu akan tersimpan dan bisa dilanjutkan nanti. 😊
                    </DialogDescription>
                    <div className='flex justify-end gap-3 pt-4'>
                        <button
                            onClick={logout}
                            className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all'
                            style={{
                                background: 'rgba(244, 90, 90, 0.15)',
                                color: '#f45a5a',
                                border: '1px solid rgba(244, 90, 90, 0.3)',
                            }}
                        >
                            <LogOut size={14} /> Keluar
                        </button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default Logout;
