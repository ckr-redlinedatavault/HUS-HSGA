import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const instiId = cookieStore.get('insti_session')?.value;

        if (!instiId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        
        // Check if all MANDATORY fields for profile completion are present
        const requiredFields = [
            'udise', 'management', 'mandal', 'address', 
            'chairmanName', 'chairmanMobile', 
            'headName', 'headPhone', 
            'email', 'principalEmail',
        ];

        // Basic check for presence (can be refined)
        const isComplete = requiredFields.every(field => body[field] && String(body[field]).trim() !== '');

        const updatedInstitution = await prisma.instiRegister.update({
            where: { uniqueId: instiId },
            data: {
                udise: body.udise,
                management: body.management,
                mandal: body.mandal,
                address: body.address,
                chairmanName: body.chairmanName,
                chairmanMobile: body.chairmanMobile,
                headName: body.headName, // Already exists but allow update
                headPhone: body.headPhone,
                altPhone: body.altPhone,
                email: body.email, // Already exists but allow update
                principalEmail: body.principalEmail,
                coordinatorName: body.coordinatorName,
                coordinatorMobile: body.coordinatorMobile,
                phoneNo: body.phoneNo, // Allow updating primary phone too
                
                // Administrative / MoU Data
                mouStatus: body.mouStatus || 'PENDING',
                mouStart: body.mouStart,
                mouEnd: body.mouEnd,
                enrollmentEstimate: body.enrollmentEstimate,
                notes: body.notes,
                staffCount: body.staffCount,
                studentCount: body.studentCount,
                totalClasses: body.totalClasses,
                feesCollected: body.feesCollected,
                recentUpdates: body.recentUpdates,

                isProfileComplete: isComplete
            }
        });

        return NextResponse.json({ 
            success: true, 
            profile: updatedInstitution,
            message: 'Profile updated successfully' 
        });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
