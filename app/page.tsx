import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import prisma from '@/lib/prisma';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 6,
    include: { category: true } // Include category relation if needed for display logic
  });
  return products;
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FFF0F0] to-[#FFE5E5] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Bước vào thế giới <span className="text-primary">Ngọt Ngào</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Cung cấp đầy đủ dụng cụ, nguyên liệu và công thức làm bánh chuẩn ngon.
          Đặt mua Combo để nhận ngay bí kíp làm bánh bất bại!
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="bg-primary text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition flex items-center">
            Mua sắm ngay <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link href="/shop?category=combo" className="bg-white text-primary border border-primary px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition">
            Xem Combo
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
          <Link href="/shop" className="text-primary hover:opacity-80 font-medium flex items-center">
            Xem tất cả <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features/Info Section */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="bg-[#FFF0F0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍰</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Đa dạng nguyên liệu</h3>
            <p className="text-gray-600">Từ bột mì, bơ, sữa đến các loại hạt cao cấp.</p>
          </div>
          <div className="p-6">
            <div className="bg-[#FFF0F0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Combo tiện lợi</h3>
            <p className="text-gray-600">Mua combo đầy đủ nguyên liệu, tặng kèm công thức chi tiết.</p>
          </div>
          <div className="p-6">
            <div className="bg-[#FFF0F0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Giao hàng nhanh</h3>
            <p className="text-gray-600">Đóng gói cẩn thận, giao hàng tận nơi trên toàn quốc.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
