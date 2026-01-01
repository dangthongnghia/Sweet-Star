import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categorySnake = searchParams.get('category'); // This handles ?category=slug

        // Prisma: filter by categoryId if present.
        // Ensure our product creation logic aligns with filtering by 'categoryId' which stores the slug 
        // (per our schema relationship: categoryId references Category.slug).
        const filter = categorySnake ? { categoryId: categorySnake } : {};

        const products = await prisma.product.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
        });

        const mappedProducts = products.map(p => ({
            ...p,
            category: p.categoryId // Map for frontend compatibility
        }));

        return NextResponse.json(mappedProducts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: Number(body.price),
                imageUrl: body.imageUrl,
                categoryId: body.category, // 'category' from frontend form is the slug
                isCombo: body.isCombo,
                recipeUrl: body.recipeUrl
            }
        });
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
