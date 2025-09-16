/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { auth } from "@/lib/auth";
import { getDataById } from "@/lib/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";


interface AuthUser {
    uid: string;
    username: string;
    email: string;
    emailVerified: boolean;
    photoURL: string;
    tokenId: string
}

type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const dataUser = await getDataById("users", user.uid);
                if(dataUser.status) {
                    setUser({...dataUser.data, tokenId: user.getIdToken()});
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};