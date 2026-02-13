import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate unique ID in format TRAI-HSGA-XXXX
async function generateUniqueId(): Promise<string> {
    const lastTrainer = await prisma.traiRegister.findFirst({
        orderBy: { uniqueId: 'desc' },
    });

    let nextNumber = 1;
    if (lastTrainer) {
        const lastNumber = parseInt(lastTrainer.uniqueId.split('-')[2], 10);
        if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    const paddedNumber = String(nextNumber).padStart(4, '0');
    return `TRAI-HSGA-${paddedNumber}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, phoneNo, email, district, password } = body;

        // Basic Validation
        if (!fullName || !phoneNo || !email || !district || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const uniqueId = await generateUniqueId();

        const registration = await prisma.traiRegister.create({
            data: {
                uniqueId,
                fullName,
                phoneNo,
                email,
                district,
                password,
            },
        });

        return NextResponse.json({ uniqueId: registration.uniqueId, id: registration.id }, { status: 201 });
    } catch (error) {
        console.error('Trainer Registration Error:', error);
        return NextResponse.json({ error: 'Failed to register trainer' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const registrations = await prisma.traiRegister.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(registrations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status || !['APPROVED', 'DECLINED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid request. Provide id and status (APPROVED or DECLINED).' }, { status: 400 });
        }

        const updated = await prisma.traiRegister.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Status Update Error:', error);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
