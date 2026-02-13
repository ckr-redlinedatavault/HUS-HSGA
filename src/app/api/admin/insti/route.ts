import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const institutions = await prisma.instiRegister.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(institutions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch institutions' }, { status: 500 });
    }
}
