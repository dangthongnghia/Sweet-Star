import Link from 'next/link';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { auth, signOut } from '@/auth';

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            Sweet Star
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-primary font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/shop" className="text-gray-700 hover:text-primary font-medium">
                            Sản phẩm
                        </Link>
                        <Link href="/shop?category=combo" className="text-gray-700 hover:text-primary font-medium">
                            Combo
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary">
                            <ShoppingCart className="w-6 h-6" />
                        </Link>

                        {session?.user ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center text-sm font-medium text-gray-700">
                                    <User className="w-5 h-5 mr-1" />
                                    {session.user.name}
                                </div>
                                {/* @ts-ignore */}
                                {session.user.role === 'ADMIN' && (
                                    <Link href="/admin/products" className="text-xl text-gray-500 hover:underline">
                                        Admin
                                    </Link>
                                )}
                                <form
                                    action={async () => {
                                        "use server"
                                        await signOut()
                                    }}
                                >
                                    <button type="submit" className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link href="/login" className="text-sm font-medium text-black bg-primary px-4 py-2 rounded-full hover:opacity-90 transition">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
