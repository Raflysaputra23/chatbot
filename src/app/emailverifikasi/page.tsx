/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MixinAlert } from "@/lib/alert";
import { auth } from "@/lib/auth";
import { addData, getDataById } from "@/lib/database";
import { onAuthStateChanged, sendEmailVerification, signOut } from "firebase/auth";
import { RefreshCcw, Loader, Send, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EmailVerifikasi = () => {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [sending, setSending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (user.emailVerified) {
                    try {
                        const data = await getDataById("users", user.uid);
                        const newUser = { ...data.data, emailVerified: user.emailVerified };
                        await addData("users", newUser, user.uid);
                        MixinAlert("success", "Verifikasi email berhasil! 🎉");
                        router.push("/dashboard");
                    } catch (error) {
                        console.error("Gagal memperbarui status user di database:", error);
                        router.push("/dashboard");
                    }
                }
            } else {
                router.push("/");
            }
        });
        return () => unsub();
    }, [router]);

    const refresh = async () => {
        if (!auth.currentUser) return;
        setRefreshing(true);
        try {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                const data = await getDataById("users", auth.currentUser.uid);
                const newUser = { ...data.data, emailVerified: true };
                await addData("users", newUser, auth.currentUser.uid);
                MixinAlert("success", "Verifikasi email berhasil! 🎉");
                router.push("/dashboard");
            } else {
                MixinAlert("info", "Email belum terverifikasi. Silakan periksa kotak masuk/spam Anda. 📧");
            }
        } catch (error) {
            console.error("Gagal reload user:", error);
            MixinAlert("error", "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setRefreshing(false);
        }
    };

    const resendEmail = async () => {
        if (!auth.currentUser) return;
        setSending(true);
        try {
            await sendEmailVerification(auth.currentUser);
            MixinAlert("success", "Email verifikasi baru telah dikirim! 📧");
            setCountdown(60); // Set countdown 60 seconds
        } catch (error: any) {
            console.error("Gagal mengirim ulang verifikasi:", error);
            if (error.code === "auth/too-many-requests") {
                MixinAlert("warning", "Terlalu banyak permintaan. Silakan tunggu beberapa saat.");
            } else {
                MixinAlert("error", "Gagal mengirim email verifikasi. Coba beberapa saat lagi.");
            }
        } finally {
            setSending(false);
        }
    };

    const keluar = async () => {
        try {
            await signOut(auth);
            MixinAlert("success", "Berhasil keluar.");
            router.push("/");
        } catch (error) {
            console.error("Gagal logout:", error);
            MixinAlert("error", "Gagal keluar.");
        }
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-[#0d0f14] overflow-hidden">
            <div className="w-full max-w-[420px] px-4">
                {/* Logo & Title */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 piko-glow animate-pulse"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                        <span className="text-white font-bold text-2xl">P</span>
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">PIKO</h1>
                    <p className="text-sm mt-1" style={{ color: '#9aa0a6' }}>
                        Pusat Informasi Konseling dan Obrolan
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl p-6 flex flex-col gap-5 items-center text-center"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}>
                    <h2 className="font-bold text-xl text-white flex items-center gap-2">
                        Verifikasi Email Kamu 📧
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: '#c8cdd6' }}>
                        Silakan cek kotak masuk atau spam di email <span className="font-medium text-white">{auth.currentUser?.email}</span> untuk memverifikasi akun kamu.
                    </p>

                    <div className="flex flex-col gap-3 w-full mt-2">
                        {/* Status Check / Refresh */}
                        <button
                            onClick={refresh}
                            disabled={refreshing}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)',
                                color: '#fff',
                                cursor: refreshing ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 20px rgba(79, 142, 247, 0.4)',
                            }}
                        >
                            {refreshing ? (
                                <><Loader size={14} className="animate-spin" /> Memeriksa...</>
                            ) : (
                                <><RefreshCcw size={14} /> Saya Sudah Verifikasi</>
                            )}
                        </button>

                        {/* Resend Email */}
                        <button
                            onClick={resendEmail}
                            disabled={sending || countdown > 0}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: (sending || countdown > 0) ? '#9aa0a6' : '#e8eaed',
                                cursor: (sending || countdown > 0) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {sending ? (
                                <><Loader size={14} className="animate-spin" /> Mengirim...</>
                            ) : countdown > 0 ? (
                                `Kirim Ulang dalam ${countdown}s`
                            ) : (
                                <><Send size={14} /> Kirim Ulang Email Verifikasi</>
                            )}
                        </button>

                        {/* Back / Logout */}
                        <button
                            onClick={keluar}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-2"
                            style={{
                                background: 'rgba(244, 90, 90, 0.15)',
                                border: '1px solid rgba(244, 90, 90, 0.3)',
                                color: '#f45a5a',
                                cursor: 'pointer',
                            }}
                        >
                            <LogOut size={14} /> Keluar / Ganti Akun
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerifikasi;
