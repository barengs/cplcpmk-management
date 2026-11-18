import React, { useState } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import api from '../lib/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            dispatch(setCredentials({ user: null, token })); // We can fetch user later or use decode
            navigate('/dashboard');
        } catch (err) {
            setError('Login gagal. Periksa kembali email dan password Anda.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">CPL Manager</h1>
                <p className="text-center text-gray-500 mb-6">Silakan login ke akun Anda</p>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <Input 
                        label="Email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <Input 
                        label="Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <Button type="submit" className="w-full mt-4">Masuk</Button>
                </form>
            </div>
        </div>
    );
}
