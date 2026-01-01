import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Create the order with nested items
        const order = await prisma.order.create({
            data: {
                customerName: body.customerName,
                phone: body.phone,
                address: body.address,
                totalAmount: body.totalAmount,
                items: {
                    create: body.items.map((item: any) => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        productId: item.productId,
                        isCombo: item.isCombo
                    }))
                }
            },
            include: { items: true }
        });

        // Check for Combo logic
        const comboItems = body.items.filter((item: any) => item.isCombo);
        let message = 'Đặt hàng thành công!';
        let recipes: string[] = [];

        if (comboItems.length > 0) {
            // Fetch actual recipe URLs from database to be secure/accurate
            const productIds = comboItems.map((i: any) => i.productId);
            const comboProducts = await prisma.product.findMany({
                where: { id: { in: productIds } },
                select: { name: true, recipeUrl: true }
            });

            recipes = comboProducts
                .filter(p => p.recipeUrl)
                .map(p => `Công thức món ${p.name}: ${p.recipeUrl}`);

            if (recipes.length > 0) {
                message = 'Đặt hàng thành công! Vì bạn đã mua Combo, công thức đã được mở khóa bên dưới.';
            }
        }

        return NextResponse.json({ order, message, recipes }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
