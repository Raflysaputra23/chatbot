import React from 'react'
import { Tabs, TabsList, TabsTrigger } from './tabs';
import Login from './formauth/login';
import Register from './formauth/register';

const Auth = () => {
    return (
        <Tabs defaultValue="login" className="w-[400px] max-w-[95%]">
            <TabsList className='bg-white/30 backdrop-blur-md shadow rounded-md'>
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
            <Login />
            <Register />
        </Tabs>
    )
}

export default Auth;
