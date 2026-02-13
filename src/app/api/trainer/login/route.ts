import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uniqueId, password } = body;

        if (!uniqueId || !password) {
            return NextResponse.json({ error: 'Unique ID and Password are required' }, { status: 400 });
        }

        const trainer = await prisma.traiRegister.findUnique({
            where: { uniqueId: uniqueId.toUpperCase().trim() },
        });

        if (!trainer || trainer.password !== password) {
            return NextResponse.json({ error: 'Invalid Trainer ID or Password. Please check and try again.' }, { status: 401 });
        }

        if (trainer.status === 'PENDING') {
            return NextResponse.json({
                error: 'Your registration is still pending approval. Please submit your physical form at the HSGA office and wait for approval.',
                status: 'PENDING'
            }, { status: 403 });
        }

        if (trainer.status === 'DECLINED') {
            return NextResponse.json({
                error: 'Your registration has been declined. Please contact the HSGA office for more information.',
                status: 'DECLINED'
            }, { status: 403 });
        }

        // Status is APPROVED — set session cookie
        const cookieStore = await cookies();
        cookieStore.set('trainer_session', trainer.uniqueId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({
            success: true,
            name: trainer.fullName,
            uniqueId: trainer.uniqueId,
        });
    } catch (error) {
        console.error('Trainer Login Error:', error);
        return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
    }
}
