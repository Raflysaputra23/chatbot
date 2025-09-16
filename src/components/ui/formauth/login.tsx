"use client";

import { FormEvent, useEffect, useState } from 'react'
import { TabsContent } from '../tabs'
import { Input } from '../input'
import { Button } from '../button'
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/auth';
import { MixinAlert } from '@/lib/alert';
import { useRouter } from 'next/navigation';
import { addData, getDataById } from '@/lib/database';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [disabledButton, setDisabledButton] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        if (email && password) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [email, password]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.emailVerified) {
                    router.push("/dashboard");
                }
            }
        });
    }, [router]);

    const login = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = response.user;

            if (!user.emailVerified) {
                MixinAlert("error", "Email belum diverifikasi!");
            } else {
                MixinAlert("success", "Login Success!");
                router.push("/dashboard");
            }
        } catch (error) {
            console.log(error);
            MixinAlert("error", "Email atau password salah!");
        }
    }

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                // CEK USER
                const user = await getDataById("users", result.user.uid);
                if (!user.status) {
                    const dataUser = {
                        uid: result.user.uid,
                        username: result.user.displayName,
                        email: result.user.email,
                        emailVerified: result.user.emailVerified,
                        photoURL: result.user.photoURL
                    }
                    const response = await addData("users", dataUser, result.user.uid);
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
        <TabsContent value="login" className='p-4 bg-white/30 backdrop-blur-md shadow rounded-md space-y-7'>
            <section className='space-y-3'>
                <h1 className='font-bold text-2xl text-center'>Masuk</h1>
                <p className='text-center text-sm text-slate-600'>Silahkan masukkan username dan password anda atau masuk menggunakan akun google</p>
            </section>
            <form onSubmit={login} className='space-y-5'>
                <div>
                    <label htmlFor="email" className='mb-1 inline-block'>email</label>
                    <Input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" id="email" className='bg-white focus-visible:ring-2 focus-visible:ring-sky-300' placeholder='Masukan email anda' autoComplete='off' />
                </div>
                <div>
                    <label htmlFor="password" className='mb-1 inline-block'>Password</label>
                    <Input onChange={(e) => setPassword(e.target.value)} value={password} type="password" name="password" id="password" className='bg-white focus-visible:ring-2 focus-visible:ring-sky-300' placeholder='Masukan password anda' />
                </div>
                <div className='flex items-center gap-5'>
                    <Button type='submit' disabled={disabledButton} className='bg-sky-500 flex-1 hover:bg-sky-600 cursor-pointer shadow'>Masuk</Button>
                    <span className='text-slate-600'>Atau</span>
                    <Button onClick={loginWithGoogle} type='button' className='bg-red-500 flex-1 hover:bg-red-600 cursor-pointer shadow'>Google</Button>
                </div>
            </form>
        </TabsContent>
    )
}

export default Login
