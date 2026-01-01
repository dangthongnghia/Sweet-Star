import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const exists = await prisma.user.findUnique({
            where: { email }
        });

        if (exists) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER'
            }
        });

        return NextResponse.json({ message: 'User created successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
