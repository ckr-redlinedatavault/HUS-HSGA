import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            district,
            schoolName,
            studentName,
            fatherName,
            dob,
            className,
            aadharNo,
            address,
            phoneNo,
            studentSignature,
            principalSignature,
            seal,
            instiId,

            // New Fields
            udise,
            management,
            mandal,
            // address is already destructured
            chairmanName,
            chairmanMobile,
            headName,
            headPhone,
            altPhone,
            principalEmail,
            instiEmail,
            coordinatorName,
            coordinatorMobile,
            mouStatus,
            mouStart,
            mouEnd,
            enrollmentEstimate,
            notes,
            staffCount,
            studentCount,
            totalClasses,
            feesCollected,
            recentUpdates
        } = body;

        // Basic Validation - Adjusted for School Data Entry
        // Ensure at least School Name and UDISE/ID are present
        if (!schoolName) {
            return NextResponse.json({ error: 'School Name is required' }, { status: 400 });
        }

        const submission = await prisma.studentAdmission.create({
            data: {
                district,
                schoolName,
                // Provide defaults for required student fields when creating a school data entry
                studentName: 'School Entry',
                fatherName: '',
                dob: '',
                className: '',
                aadharNo: '',
                phoneNo: '',
                studentSignature: '',
                principalSignature: '',
                seal: '',

                // New Fields mapping
                udise,
                management,
                mandal,
                address,
                chairmanName,
                chairmanMobile,
                headName,
                headPhone,
                altPhone,
                principalEmail,
                instiEmail, // mapped from email in form
                coordinatorName,
                coordinatorMobile,
                mouStatus,
                mouStart,
                mouEnd,
                enrollmentEstimate,
                notes,
                staffCount,
                studentCount,
                totalClasses,
                feesCollected,
                recentUpdates,

                instiId: instiId || null,
            },
        });

        return NextResponse.json(submission, { status: 201 });
    } catch (error) {
        console.error('Submission Error:', error);
        return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const submissions = await prisma.studentAdmission.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
