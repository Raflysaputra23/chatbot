"use client";

import Aside from "@/components/ui/aside"
import Body from "@/components/ui/body"
import Header from "@/components/ui/header"
import { auth } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const Dashboard = ({ params } : { params: Promise<{ token: string[] }> }) => {
    const [token, setToken] = useState<string>("");
    const param = use(params);
    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (!user.emailVerified) {
                    router.push("/");
                }
            } else {
                router.push("/");
            }
        });
    }, [router]);

    useEffect(() => {
        if (param?.token?.length > 0) {
            setToken(param.token[0]);
        }
    }, [param]);

    return (
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-3 overflow-y-auto overflow-x-hidden lg:p-4">
            <Aside />
            <section className="flex flex-col h-full overflow-hidden p-4 lg:px-20 bg-white/30 backdrop-blur-md rounded-md shadow">
                <Header />
                <Body token={token} />
            </section>
        </div>
    )
}

export default Dashboard;
