"use client";

import { useCart } from '@/context/CartContext';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeFromCart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        customerName: '',
        phone: '',
        address: ''
    });

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    items,
                    totalAmount: cartTotal
                })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.recipes && data.recipes.length > 0) {
                    alert(`${data.message}\n\n${data.recipes.join('\n')}\n\n(Vui lòng lưu lại link này)`);
                } else {
                    alert(data.message);
                }
                clearCart();
                router.push('/');
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
                <p className="text-gray-500 mb-8">Hãy thêm vài món đồ làm bánh vào nhé!</p>
                <Link href="/shop" className="bg-primary text-black px-6 py-2 rounded-full hover:opacity-90 transition">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Cart Items */}
                <div className="space-y-6">
                    {items.map((item) => (
                        <div key={item.productId} className="flex gap-4 border-b pb-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-md relative overflow-hidden flex-shrink-0">
                                <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                                    <button onClick={() => removeFromCart(item.productId)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">Số lượng: {item.quantity}</p>
                                <p className="font-bold text-primary">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                </p>
                                {item.isCombo && (
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                        + Tặng công thức
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center text-xl font-bold pt-4">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                        </span>
                    </div>

                    <Link href="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mt-4">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Tiếp tục mua sắm
                    </Link>
                </div>

                {/* Checkout Form */}
                <div className="bg-gray-50 p-8 rounded-lg h-fit">
                    <h2 className="text-xl font-bold mb-6">Thông tin đặt hàng</h2>
                    <form onSubmit={handleCreateOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên của bạn</label>
                            <input
                                required
                                type="text"
                                className="w-full border rounded-md px-3 py-2 bg-white focus:ring-primary focus:border-primary"
                                placeholder="Nguyễn Văn A"
                                value={form.customerName}
                                onChange={e => setForm({ ...form, customerName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại (Zalo)</label>
                            <input
                                required
                                type="tel"
                                className="w-full border rounded-md px-3 py-2 bg-white focus:ring-primary focus:border-primary"
                                placeholder="0912345678"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">Công thức sẽ được gửi qua số này nếu bạn mua Combo.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full border rounded-md px-3 py-2 bg-white focus:ring-primary focus:border-primary"
                                placeholder="Số nhà, đường, phường, quận..."
                                value={form.address}
                                onChange={e => setForm({ ...form, address: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black py-3 rounded-md font-bold hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
