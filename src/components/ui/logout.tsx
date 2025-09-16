"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './button';
import { LogOut } from 'lucide-react';
import { MixinAlert } from '@/lib/alert';
import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
    const auth = getAuth();

    const logout = async () => {
        try {
            await signOut(auth);
            MixinAlert("success", "Logout Success!");
        } catch (error) {
            console.error(error);
            MixinAlert("error", "Logout Gagal!");
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='w-full flex justify-start items-center gap-3 bg-red-600 hover:bg-red-700 cursor-pointer'><LogOut /> Keluar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Keluar</DialogTitle>
                    <DialogDescription>
                       Apakah anda yakin ingin keluar dari akun?
                    </DialogDescription>
                    <DialogDescription className='p-2 w-full flex justify-end'>
                        <Button className='flex items-center gap-3 cursor-pointer bg-red-600 hover:bg-red-700' onClick={logout}>Keluar <LogOut /> </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Logout
