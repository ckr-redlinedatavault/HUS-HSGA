import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const trainerId = (await cookieStore).get('trainer_session')?.value;

        if (!trainerId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const trainer = await prisma.traiRegister.findUnique({
            where: { uniqueId: trainerId },
        });

        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        return NextResponse.json(trainer);
    } catch (error) {
        console.error('Fetch Trainer Error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
