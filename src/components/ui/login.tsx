"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './button';
import { LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/auth';
import { addData, getDataById } from '@/lib/database';
import { MixinAlert } from '@/lib/alert';
import { useEffect } from 'react';
import { useAuth } from '@/hook/useAuth';

const Login = () => {
   
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if(result.user) {
                // CEK USER
                const user = await getDataById("users", result.user.uid);
                if(!user.status) {
                    const response = await addData("users", result.user, result.user.uid);
                    if (response.status) {
                        MixinAlert("success", "Login Success!");
                    } else {
                        MixinAlert("error", "Login Gagal!");
                    }
                } else {
                    MixinAlert("success", "Login Success!");
                }

            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog open={true}>
            <DialogTrigger asChild>
                <Button className='w-full flex justify-start items-center gap-3 bg-blue-600 hover:bg-blue-700 cursor-pointer'><LogIn /> Masuk</Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Masuk</DialogTitle>
                    <DialogDescription>
                       Silahkan login terlebih dahulu untuk melakukan obrolan dengan chatbot
                    </DialogDescription>
                    <DialogDescription className='p-2 flex justify-end w-full'>
                        <Button className='flex items-center gap-3 cursor-pointer bg-blue-600 hover:bg-blue-700' onClick={loginWithGoogle}> Masuk Dengan Google <LogIn /></Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Login
