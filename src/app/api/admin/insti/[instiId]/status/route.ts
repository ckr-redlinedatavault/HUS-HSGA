import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ instiId: string }> }
) {
    try {
        const { status } = await request.json();
        const { instiId: id } = await params;

        if (!['APPROVED', 'DECLINED', 'PENDING'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const institution = await prisma.instiRegister.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(institution);
    } catch (error) {
        console.error('Update Insti Status Error:', error);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
