"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            alert("Đăng ký thành công! Hãy đăng nhập.");
            router.push('/login');
        } else {
            const data = await res.json();
            setError(data.error || 'Đăng ký thất bại');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">Đăng ký thành viên</h1>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-2 rounded mt-1 focus:ring-primary focus:border-primary"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
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
                        Đăng ký
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Đã có tài khoản? <Link href="/login" className="text-primary hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
