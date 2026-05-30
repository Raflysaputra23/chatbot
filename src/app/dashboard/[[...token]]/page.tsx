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
        <div className="h-full w-full flex overflow-hidden" style={{ background: '#0d0f14' }}>
            {/* Sidebar */}
            <Aside />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div
                    className="flex-1 flex flex-col overflow-hidden"
                    style={{ maxWidth: '900px', width: '100%', margin: '0 auto', alignSelf: 'stretch' }}
                >
                    <Body token={token} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
