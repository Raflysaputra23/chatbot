import React from 'react'
import { Tabs, TabsList, TabsTrigger } from './tabs';
import Login from './formauth/login';
import Register from './formauth/register';

const Auth = () => {
    return (
        <div className='w-full max-w-[420px] px-4'>
            {/* Logo & Title */}
            <div className='flex flex-col items-center mb-8'>
                <div className='w-16 h-16 rounded-2xl flex items-center justify-center mb-4 piko-glow'
                    style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                    <span className='text-white font-bold text-2xl'>P</span>
                </div>
                <h1 className='text-3xl font-bold gradient-text'>PIKO</h1>
                <p className='text-sm mt-1' style={{ color: '#9aa0a6' }}>
                    Pusat Informasi Konseling dan Obrolan
                </p>
            </div>

            {/* Card */}
            <div className='rounded-2xl p-6'
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className='w-full mb-6 p-1 rounded-xl'
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <TabsTrigger value="login"
                            className='flex-1 rounded-lg text-sm font-medium transition-all data-[state=active]:text-white'
                            style={{ color: '#9aa0a6' }}>
                            Masuk
                        </TabsTrigger>
                        <TabsTrigger value="register"
                            className='flex-1 rounded-lg text-sm font-medium transition-all data-[state=active]:text-white'
                            style={{ color: '#9aa0a6' }}>
                            Daftar
                        </TabsTrigger>
                    </TabsList>
                    <Login />
                    <Register />
                </Tabs>
            </div>

            {/* Footer */}
            <p className='text-center text-xs mt-6' style={{ color: '#9aa0a6' }}>
                Dibuat dengan ❤️ oleh{' '}
                <a href='https://instagram.com/raynardalmer' target='_blank' rel='noopener noreferrer'
                    className='font-medium' style={{ color: '#4f8ef7' }}>
                    @raynardalmer
                </a>
            </p>
        </div>
    )
}

export default Auth;
