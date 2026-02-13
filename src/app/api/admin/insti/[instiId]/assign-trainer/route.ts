import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ instiId: string }> }
) {
    try {
        const { trainerId } = await request.json();
        const { instiId: id } = await params;

        const institution = await prisma.instiRegister.update({
            where: { id },
            data: { trainerId },
        });

        return NextResponse.json(institution);
    } catch (error) {
        console.error('Assign Trainer Error:', error);
        return NextResponse.json({ error: 'Failed to assign trainer' }, { status: 500 });
    }
}
