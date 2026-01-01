"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCatName, setNewCatName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName) return;
        try {
            const slug = newCatName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName, slug })
            });
            if (res.ok) {
                setNewCatName('');
                fetchCategories();
            } else {
                alert("Lỗi khi thêm danh mục");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản lý Danh mục</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-xl">
                <h2 className="font-bold mb-4">Thêm danh mục mới</h2>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        className="border p-2 rounded flex-1 focus:ring-primary focus:border-primary"
                        placeholder="Tên danh mục (ví dụ: Khuôn Bánh)"
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-primary text-black px-4 py-2 rounded-lg hover:opacity-90 flex items-center font-medium">
                        <Plus className="w-5 h-5 mr-1" /> Thêm
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((cat: any) => (
                            <tr key={cat.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cat.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{cat.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-red-600 hover:text-red-900 cursor-not-allowed opacity-50" title="Chưa hỗ trợ xóa">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
