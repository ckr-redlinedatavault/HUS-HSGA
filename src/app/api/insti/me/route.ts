import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const instiId = cookieStore.get('insti_session')?.value;

        if (!instiId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const institution = await prisma.instiRegister.findUnique({
            where: { uniqueId: instiId },
            select: {
                uniqueId: true,
                instiName: true,
                instiType: true,
                headName: true,
                phoneNo: true,
                email: true,
                district: true,
                status: true,
                trainerId: true,
                createdAt: true,
                // Profile Fields
                udise: true,
                management: true,
                mandal: true,
                address: true,
                chairmanName: true,
                chairmanMobile: true,
                headPhone: true,
                altPhone: true,
                principalEmail: true,
                coordinatorName: true,
                coordinatorMobile: true,
                mouStatus: true,
                mouStart: true,
                mouEnd: true,
                enrollmentEstimate: true,
                notes: true,
                staffCount: true,
                studentCount: true,
                totalClasses: true,
                feesCollected: true,
                recentUpdates: true,
                isProfileComplete: true,
            }
        });

        if (!institution) {
            return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
        }

        // Fetch Trainer Name if assigned
        let trainerName = null;
        if (institution.trainerId) {
            const trainer = await prisma.traiRegister.findUnique({
                where: { uniqueId: institution.trainerId },
                select: { fullName: true }
            });
            trainerName = trainer?.fullName || null;
        }

        return NextResponse.json({
            ...institution,
            trainerName
        });
    } catch (error) {
        console.error('Fetch Insti Profile Error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
