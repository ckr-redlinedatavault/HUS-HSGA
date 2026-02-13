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

        const institution = await prisma.instiRegister.findUnique({
            where: { uniqueId: uniqueId.toUpperCase().trim() },
        });

        if (!institution || institution.password !== password) {
            return NextResponse.json({ error: 'Invalid Institutional ID or Password.' }, { status: 401 });
        }

        if (institution.status === 'PENDING') {
            return NextResponse.json({
                error: 'Your registration is still pending approval. Please submit physical documents and wait for verification.',
                status: 'PENDING'
            }, { status: 403 });
        }

        if (institution.status === 'DECLINED') {
            return NextResponse.json({
                error: 'Your registration has been declined. Please contact the HSGA office.',
                status: 'DECLINED'
            }, { status: 403 });
        }

        const cookieStore = await cookies();
        cookieStore.set('insti_session', institution.uniqueId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({
            success: true,
            name: institution.instiName,
            uniqueId: institution.uniqueId,
        });
    } catch (error) {
        console.error('Institutional Login Error:', error);
        return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
    }
}
