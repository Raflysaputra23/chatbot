"use client";

import { FormEvent, useEffect, useState } from 'react'
import { TabsContent } from '../tabs'
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/auth';
import { MixinAlert } from '@/lib/alert';
import { useRouter } from 'next/navigation';
import { addData, getDataById } from '@/lib/database';
import { Eye, EyeOff, Mail, Lock, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    const disabled = !email || !password || loading || googleLoading;

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

    const login = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = response.user;
            if (!user.emailVerified) {
                MixinAlert("error", "Email belum diverifikasi! Cek inbox kamu 📧");
            } else {
                MixinAlert("success", "Selamat datang kembali! 🎉");
                router.push("/dashboard");
            }
            setEmail(''); setPassword('');
        } catch {
            MixinAlert("error", "Email atau password salah!");
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (e: FormEvent) => {
        e.preventDefault();
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                const user = await getDataById("users", result.user.uid);
                if (!user.status) {
                    const dataUser = {
                        uid: result.user.uid,
                        username: result.user.displayName,
                        email: result.user.email,
                        emailVerified: result.user.emailVerified,
                        photoURL: result.user.photoURL
                    };
                    const response = await addData("users", dataUser, result.user.uid);
                    if (response.status) {
                        MixinAlert("success", "Berhasil masuk dengan Google! 🎉");
                        router.push("/dashboard");
                    } else {
                        MixinAlert("error", "Login gagal!");
                    }
                } else {
                    MixinAlert("success", "Selamat datang kembali! 🎉");
                }
            }
        } catch (error) {
            console.error(error);
            MixinAlert("error", "Login Google gagal!");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <TabsContent value="login" className='space-y-6'>
            <div className='space-y-1 text-center'>
                <h1 className='font-bold text-2xl text-white'>Selamat Datang! 👋</h1>
                <p className='text-sm' style={{ color: '#9aa0a6' }}>Masuk untuk mulai ngobrol dengan PIKO</p>
            </div>

            <form onSubmit={login} className='space-y-4'>
                {/* Email */}
                <div className='space-y-1.5'>
                    <label htmlFor="email-login" className='text-sm font-medium' style={{ color: '#c8cdd6' }}>Email</label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#9aa0a6' }}>
                            <Mail size={16} />
                        </div>
                        <input
                            id="email-login"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder='email@kamu.com'
                            autoComplete='off'
                            className='w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e8eaed',
                            }}
                            onFocus={e => {
                                e.target.style.border = '1px solid rgba(79, 142, 247, 0.5)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(79, 142, 247, 0.1)';
                            }}
                            onBlur={e => {
                                e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className='space-y-1.5'>
                    <label htmlFor="password-login" className='text-sm font-medium' style={{ color: '#c8cdd6' }}>Password</label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#9aa0a6' }}>
                            <Lock size={16} />
                        </div>
                        <input
                            id="password-login"
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder='••••••••'
                            className='w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e8eaed',
                            }}
                            onFocus={e => {
                                e.target.style.border = '1px solid rgba(79, 142, 247, 0.5)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(79, 142, 247, 0.1)';
                            }}
                            onBlur={e => {
                                e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button type='button' onClick={() => setShowPass(!showPass)}
                            className='absolute right-3 top-1/2 -translate-y-1/2'
                            style={{ color: '#9aa0a6' }}>
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type='submit'
                    disabled={disabled}
                    className='w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2'
                    style={{
                        background: disabled ? 'rgba(79, 142, 247, 0.3)' : 'linear-gradient(135deg, #4f8ef7, #9b59f5)',
                        color: '#fff',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        boxShadow: !disabled ? '0 4px 20px rgba(79, 142, 247, 0.4)' : 'none',
                    }}
                >
                    {loading ? <><Loader size={14} className="animate-spin" /> Masuk...</> : 'Masuk'}
                </button>
            </form>

            {/* Divider */}
            <div className='flex items-center gap-3'>
                <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                <span className='text-xs' style={{ color: '#9aa0a6' }}>atau</span>
                <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Google */}
            <button
                onClick={loginWithGoogle}
                disabled={googleLoading || loading}
                className='w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-3'
                style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e8eaed',
                    cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                }}
            >
                {googleLoading ? <Loader size={14} className="animate-spin" /> : (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                )}
                Masuk dengan Google
            </button>
        </TabsContent>
    );
};

export default Login;
