"use client";

import { Button } from "@/components/ui/button"
import { MixinAlert } from "@/lib/alert";
import { auth } from "@/lib/auth";
import { addData, getDataById } from "@/lib/database";
import { onAuthStateChanged } from "firebase/auth";
import { Clock, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EmailVerifikasi = () => {
    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (user.emailVerified) {
                    const data = await getDataById("users", user.uid);
                    const newUser = { ...data.data, emailVerified: user.emailVerified };
                    await addData("users", newUser, user.uid);
                    MixinAlert("success", "Verifikasi email berhasil!");
                    router.push("/");
                }
            }
        });
    }, [router]);

    const refresh = async () => {
        if (auth.currentUser) {
            window.location.reload();
        }
    }
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="p-6 bg-white/30 backdrop-blur-md shadow rounded-md flex flex-col gap-5 items-center w-max-[95%] w-96">
                <h1 className="font-bold text-2xl">Verifikasi Email</h1>
                <p className="text-sm text-slate-600 text-center">Silahkan cek email anda untuk melakukan verifikasi email</p>
                <div className="space-x-2">
                    <Button className="bg-red-500 flex-1 hover:bg-red-600 cursor-pointer shadow">Belum verifikasi <Clock /></Button>
                    <Button onClick={refresh} className="bg-sky-500 flex-1 hover:bg-sky-600 cursor-pointer shadow">Refresh <RefreshCcw /></Button>
                </div>
            </div>
        </div>
    )
}

export default EmailVerifikasi
