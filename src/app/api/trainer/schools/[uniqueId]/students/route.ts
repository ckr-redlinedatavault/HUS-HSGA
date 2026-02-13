import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uniqueId: string }> }
) {
    try {
        const { uniqueId } = await params;

        // Fetch students where instiId matches the school's uniqueId
        const students = await prisma.studentAdmission.findMany({
            where: { instiId: uniqueId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error('Fetch School Students Error:', error);
        return NextResponse.json({ error: 'Failed to fetch student list' }, { status: 500 });
    }
}
