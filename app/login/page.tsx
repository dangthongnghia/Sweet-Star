"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Using NextAuth signIn
        const res = await signIn('credentials', {
            redirect: false,
            email: form.email,
            password: form.password,
        });

        if (res?.error) {
            setError('Invalid email or password');
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">Đăng nhập Sweet Star</h1>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border p-2 rounded mt-1 focus:ring-primary focus:border-primary"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            className="w-full border p-2 rounded mt-1 focus:ring-primary focus:border-primary"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-black py-2 rounded hover:opacity-90 font-bold transition">
                        Đăng nhập
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Chưa có tài khoản? <Link href="/register" className="text-primary hover:underline">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}
