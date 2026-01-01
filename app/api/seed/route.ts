import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Clear existing data
        // Delete items first to avoid foreign key constraints if cascading not set
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});

        // Seed Categories
        await prisma.category.createMany({
            data: [
                { name: 'Dụng cụ làm bánh', slug: 'dung-cu' },
                { name: 'Nguyên liệu', slug: 'nguyen-lieu' },
                { name: 'Combo', slug: 'combo' },
                { name: 'Công thức', slug: 'cong-thuc' },
                { name: 'Bánh thành phẩm', slug: 'banh' },
            ]
        });

        // Seed Products
        // Create via createMany is fine, but relation needs exact slug match.
        await prisma.product.createMany({
            data: [
                {
                    name: 'Máy đánh trứng Philips',
                    description: 'Máy đánh trứng cầm tay tiện lợi, công suất lớn.',
                    price: 500000,
                    imageUrl: 'https://images.unsplash.com/photo-1595604683058-208b044d081b?q=80&w=600&auto=format&fit=crop',
                    categoryId: 'dung-cu',
                    isCombo: false,
                },
                {
                    name: 'Bột mì đa dụng 1kg',
                    description: 'Bột mì cao cấp, thích hợp làm nhiều loại bánh.',
                    price: 25000,
                    imageUrl: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?q=80&w=600&auto=format&fit=crop',
                    categoryId: 'nguyen-lieu',
                    isCombo: false,
                },
                {
                    name: 'Combo Làm Bánh Bông Lan Trứng Muối',
                    description: 'Bao gồm đầy đủ nguyên liệu: Bột, trứng muối, sốt dầu trứng. Tặng kèm công thức chi tiết.',
                    price: 150000,
                    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop',
                    categoryId: 'combo',
                    isCombo: true,
                    recipeUrl: 'https://example.com/cong-thuc-bong-lan',
                },
                {
                    name: 'Phới lồng silicon',
                    description: 'Chịu nhiệt tốt, bền bỉ.',
                    price: 45000,
                    imageUrl: 'https://plus.unsplash.com/premium_photo-1664297989345-f4ff2063b212?q=80&w=600&auto=format&fit=crop',
                    categoryId: 'dung-cu',
                    isCombo: false,
                }
            ]
        });

        return NextResponse.json({ message: 'Database seeded successfully with Prisma' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
