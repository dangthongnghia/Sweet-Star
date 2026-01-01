import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

async function getProducts(categorySlug?: string) {
    const where: any = {
        category: { slug: { not: 'cong-thuc' } }
    };

    if (categorySlug) {
        where.category.slug = categorySlug;
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });
    return products;
}

async function getCategories() {
    const categories = await prisma.category.findMany({
        where: { slug: { not: 'cong-thuc' } },
        orderBy: { name: 'asc' }
    });
    return categories;
}

export const dynamic = 'force-dynamic';

export default async function ShopPage(props: { searchParams: Promise<{ category?: string }> }) {
    const searchParams = await props.searchParams;
    const categorySlug = searchParams.category;

    const products = await getProducts(categorySlug);
    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar / Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                        <h3 className="font-bold text-lg mb-4">Danh mục</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/shop"
                                    className={cn(
                                        "block px-3 py-2 rounded-md transition",
                                        !categorySlug ? "bg-[#FFF0F0] text-primary font-bold" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    Tất cả sản phẩm
                                </Link>
                            </li>
                            {categories.map((cat: any) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/shop?category=${cat.slug}`}
                                        className={cn(
                                            "block px-3 py-2 rounded-md transition capitalize",
                                            categorySlug === cat.slug ? "bg-[#FFF0F0] text-primary font-bold" : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 capitalize">
                            {categorySlug
                                ? categories.find((c: any) => c.slug === categorySlug)?.name || 'Sản phẩm'
                                : 'Tất cả sản phẩm'
                            }
                        </h1>
                        <span className="text-gray-500 text-sm">
                            Tìm thấy {products.length} sản phẩm
                        </span>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Chưa có sản phẩm nào trong danh mục này.</p>
                            <Link href="/shop" className="text-primary mt-2 inline-block hover:underline">Xem tất cả</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
