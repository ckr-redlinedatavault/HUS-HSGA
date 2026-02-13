import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const trainers = await prisma.traiRegister.findMany({
            where: { status: 'APPROVED' },
            select: {
                uniqueId: true,
                fullName: true,
                district: true,
            },
            orderBy: { fullName: 'asc' },
        });
        return NextResponse.json(trainers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch trainers' }, { status: 500 });
    }
}
