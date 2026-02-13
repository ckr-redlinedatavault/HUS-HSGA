import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; // Adjust import path if needed

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        const newEntry = await prisma.publicForm.create({
            data: {
                name,
                email,
                message,
            },
        });

        return NextResponse.json({ success: true, data: newEntry });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}
