import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-pink-600">Sweet Star</h1>
                    <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/products" className="flex items-center px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition">
                        <Package className="w-5 h-5 mr-3" />
                        Sản phẩm
                    </Link>
                    <Link href="/admin/orders" className="flex items-center px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition">
                        <ShoppingBag className="w-5 h-5 mr-3" />
                        Đơn hàng
                    </Link>
                    <Link href="/admin/categories" className="flex items-center px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition">
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Danh mục
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Link href="/" className="flex items-center px-4 py-3 text-gray-500 hover:text-red-600 transition">
                        <LogOut className="w-5 h-5 mr-3" />
                        Thoát
                    </Link>
                </div>
            </aside>

            {/* Mobile Header (simplified) */}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
