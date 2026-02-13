import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function generateUniqueId() {
    const lastRegistration = await prisma.instiRegister.findFirst({
        orderBy: { uniqueId: 'desc' },
    });

    let nextNumber = 1;
    if (lastRegistration && lastRegistration.uniqueId.startsWith('INST-HSGA-')) {
        const currentNumber = parseInt(lastRegistration.uniqueId.split('-')[2]);
        if (!isNaN(currentNumber)) {
            nextNumber = currentNumber + 1;
        }
    }

    return `INST-HSGA-${nextNumber.toString().padStart(4, '0')}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { instiName, instiType, headName, phoneNo, email, district, password } = body;

        // Validation
        if (!instiName || !instiType || !headName || !phoneNo || !email || !district || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const uniqueId = await generateUniqueId();

        const registration = await prisma.instiRegister.create({
            data: {
                uniqueId,
                instiName,
                instiType,
                headName,
                phoneNo,
                email,
                district,
                password,
            },
        });

        return NextResponse.json({ uniqueId: registration.uniqueId, id: registration.id }, { status: 201 });
    } catch (error) {
        console.error('Institutional Registration Error:', error);
        return NextResponse.json({ error: 'Failed to register institution' }, { status: 500 });
    }
}
