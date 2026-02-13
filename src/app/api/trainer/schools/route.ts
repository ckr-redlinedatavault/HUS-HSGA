import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const trainerId = cookieStore.get('trainer_session')?.value;

        if (!trainerId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const schools = await prisma.instiRegister.findMany({
            where: { trainerId, status: 'APPROVED' },
            select: {
                uniqueId: true,
                instiName: true,
                instiType: true,
                district: true,
                headName: true,
                phoneNo: true,
                email: true,
            }
        });

        return NextResponse.json(schools);
    } catch (error) {
        console.error('Fetch Trainer Schools Error:', error);
        return NextResponse.json({ error: 'Failed to fetch assigned schools' }, { status: 500 });
    }
}
