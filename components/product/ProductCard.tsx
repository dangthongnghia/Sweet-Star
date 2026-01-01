"use client";

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        alert(`Đã thêm ${product.name} vào giỏ!`);
        // In real app, use toast instead of alert
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="relative h-48 w-full bg-gray-100">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                />
                {product.isCombo && (
                    <span className="absolute top-2 left-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded-full">
                        Combo + Công thức
                    </span>
                )}
            </div>
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 capitalize">
                    {typeof product.category === 'object' ? product.category?.name : product.category}
                </p>
                <h3 className="font-bold text-gray-900 mb-1 truncate" title={product.name}>{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 h-10 mb-4">{product.description}</p>

                <div className="flex items-center justify-between">
                    <span className="font-bold text-primary block">{formatPrice(product.price)}</span>
                    <button
                        onClick={handleAddToCart}
                        className="bg-primary text-black p-2 rounded-full hover:opacity-80 transition shadow-sm"
                        title="Thêm vào giỏ"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
