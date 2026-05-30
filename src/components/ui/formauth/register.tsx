"use client";

import { TabsContent } from '../tabs';
import { FormEvent, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { MixinAlert } from '@/lib/alert';
import { useRouter } from 'next/navigation';
import { addData } from '@/lib/database';
import { Eye, EyeOff, Mail, Lock, User, Loader } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const passwordMatch = password && confirmPassword && password === confirmPassword;
    const disabled = !username || !email || !password || !confirmPassword || !passwordMatch || loading;

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
        setLoading(true);
        let user;
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            user = response.user;
        } catch (error: any) {
            console.error("Registrasi gagal:", error);
            const msg = error.code === "auth/email-already-in-use"
                ? "Email sudah terdaftar!"
                : "Gagal membuat akun. Silakan coba lagi.";
            MixinAlert("error", msg);
            setLoading(false);
            return;
        }

        try {
            const dataUser = {
                uid: user.uid,
                username: username,
                email: user.email,
                emailVerified: user.emailVerified,
                photoURL: user.photoURL
            };
            await addData("users", dataUser, user.uid);
            await sendEmailVerification(user);
            MixinAlert("success", "Verifikasi email telah dikirim! 📧");
            router.push("/emailverifikasi");
            setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
        } catch (error: any) {
            console.error("Gagal mengirim email verifikasi:", error);
            MixinAlert("warning", "Akun berhasil didaftarkan, namun gagal mengirim email verifikasi otomatis. Silakan kirim ulang dari halaman verifikasi.");
            router.push("/emailverifikasi");
            setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#e8eaed',
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = '1px solid rgba(79, 142, 247, 0.5)';
        e.target.style.boxShadow = '0 0 0 3px rgba(79, 142, 247, 0.1)';
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = '1px solid rgba(255,255,255,0.1)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <TabsContent value="register" className='space-y-5'>
            <div className='space-y-1 text-center'>
                <h1 className='font-bold text-2xl text-white'>Buat Akun ✨</h1>
                <p className='text-sm' style={{ color: '#9aa0a6' }}>Daftar gratis dan mulai ngobrol dengan PIKO</p>
            </div>

            <form className='space-y-3.5' onSubmit={daftar}>
                {/* Username */}
                <div className='space-y-1.5'>
                    <label htmlFor="username" className='text-sm font-medium' style={{ color: '#c8cdd6' }}>Username</label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#9aa0a6' }}>
                            <User size={16} />
                        </div>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder='Username kamu'
                            autoComplete='off'
                            minLength={2}
                            required
                            className='w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={inputStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className='space-y-1.5'>
                    <label htmlFor="email-reg" className='text-sm font-medium' style={{ color: '#c8cdd6' }}>Email</label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#9aa0a6' }}>
                            <Mail size={16} />
                        </div>
                        <input
                            id="email-reg"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder='email@kamu.com'
                            minLength={4}
                            required
                            className='w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={inputStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className='space-y-1.5'>
                    <label htmlFor="password-reg" className='text-sm font-medium' style={{ color: '#c8cdd6' }}>Password</label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#9aa0a6' }}>
                            <Lock size={16} />
                        </div>
                        <input
                            id="password-reg"
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder='Min. 6 karakter'
                            minLength={6}
                            required
                            className='w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={inputStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        <button type='button' onClick={() => setShowPass(!showPass)}
                            className='absolute right-3 top-1/2 -translate-y-1/2'
                            style={{ color: '#9aa0a6' }}>
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className='space-y-1.5'>
                    <label htmlFor="confirm-password" className='text-sm font-medium' style={{ color: '#c8cdd6' }}>
                        Konfirmasi Password
                        {confirmPassword && (
                            <span className='ml-2 text-xs'>
                                {passwordMatch
                                    ? <span style={{ color: '#34d399' }}>✓ Cocok</span>
                                    : <span style={{ color: '#f45a5a' }}>✗ Tidak cocok</span>
                                }
                            </span>
                        )}
                    </label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#9aa0a6' }}>
                            <Lock size={16} />
                        </div>
                        <input
                            id="confirm-password"
                            type={showConfirmPass ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder='Ulangi password'
                            minLength={6}
                            required
                            className='w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={{
                                ...inputStyle,
                                border: confirmPassword
                                    ? (passwordMatch ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid rgba(244, 90, 90, 0.5)')
                                    : inputStyle.border
                            }}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        <button type='button' onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className='absolute right-3 top-1/2 -translate-y-1/2'
                            style={{ color: '#9aa0a6' }}>
                            {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type='submit'
                    disabled={disabled}
                    className='w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-2'
                    style={{
                        background: disabled ? 'rgba(79, 142, 247, 0.3)' : 'linear-gradient(135deg, #4f8ef7, #9b59f5)',
                        color: '#fff',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        boxShadow: !disabled ? '0 4px 20px rgba(79, 142, 247, 0.4)' : 'none',
                    }}
                >
                    {loading ? <><Loader size={14} className="animate-spin" /> Mendaftar...</> : 'Daftar Sekarang'}
                </button>
            </form>
        </TabsContent>
    );
};

export default Register;
