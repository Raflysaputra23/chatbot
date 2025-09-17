"use client";

import { Input } from '../input';
import { Button } from '../button';
import { TabsContent } from '../tabs';
import { FormEvent, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { MixinAlert } from '@/lib/alert';
import { useRouter } from 'next/navigation';
import { addData } from '@/lib/database';



const Register = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [disabledButton, setDisabledButton] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        if (username && email && password && confirmPassword) {
            if (password === confirmPassword) {
                setDisabledButton(false);
            } else {
                setDisabledButton(true);
            }
        }
    }, [username, email, password, confirmPassword]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.emailVerified) {
                    router.push("/dashboard");
                } else {
                    router.push("/emailverifikasi");
                }
            }
        });
    }, [router]);

    const daftar = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            if(response) {
                const user = response.user;
                const dataUser = {
                    uid: user.uid,
                    username: username,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL
                }
    
                await addData("users", dataUser, user.uid);
                await sendEmailVerification(user);
                MixinAlert("success", "Verifikasi email telah dikirim!");
                router.push("/emailverifikasi");
            }
        } catch (error) {
            console.log(error);
            MixinAlert("error", "Email sudah terdaftar!");
        }
    }

    return (
        <TabsContent value="register" className='p-4 bg-white/30 backdrop-blur-md shadow rounded-md space-y-7'>
            <section className='space-y-3'>
                <h1 className='font-bold text-2xl text-center'>Daftar</h1>
                <p className='text-center text-sm text-slate-600'>Silahkan daftarkan akun anda untuk bisa melakukan obrolan dengan chatbot</p>
            </section>
            <form className='space-y-5' onSubmit={daftar}>
                <div>
                    <label htmlFor="username" className='mb-1 inline-block'>Username</label>
                    <Input onChange={(e) => setUsername(e.target.value)} value={username} minLength={2} type="text" name="username" id="username" className='bg-white focus-visible:ring-2 focus-visible:ring-sky-300' placeholder='Masukan username anda' autoComplete='off' required />
                </div>
                <div>
                    <label htmlFor="email" className='mb-1 inline-block'>Email</label>
                    <Input onChange={(e) => setEmail(e.target.value)} value={email} minLength={4} type="email" name="email" id="email" className='bg-white focus-visible:ring-2 focus-visible:ring-sky-300' placeholder='Masukan password anda' required />
                </div>
                <div>
                    <label htmlFor="password" className='mb-1 inline-block'>Password</label>
                    <Input onChange={(e) => setPassword(e.target.value)} value={password} minLength={6} type="password" name="password" id="password" className='bg-white focus-visible:ring-2 focus-visible:ring-sky-300' placeholder='Masukan password anda' required />
                </div>
                <div>
                    <label htmlFor="password" className='mb-1 inline-block'>Confirm Password</label>
                    <Input onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} value={confirmPassword} type="password" name="confirm-password" id="confirm-password" className='bg-white focus-visible:ring-2 focus-visible:ring-sky-300' placeholder='Masukan password anda' required />
                </div>
                <Button disabled={disabledButton} type='submit' className='bg-sky-500 flex-1 hover:bg-sky-600 cursor-pointer shadow'>Daftar</Button>
            </form>
        </TabsContent>
    )
}

export default Register;
