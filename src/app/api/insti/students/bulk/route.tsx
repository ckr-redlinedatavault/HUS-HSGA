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
        const { students, schoolName, district } = body;

        if (!students || !Array.isArray(students) || students.length === 0) {
            return NextResponse.json({ error: 'No student data provided' }, { status: 400 });
        }

        // Validate and prepare data
        // "students" array now contains School Data Entries
        const validatedEntries = students.map((s: any) => ({
            district,
            schoolName,
            instiId,

            // School Data Fields
            udise: s.udise || '',
            management: s.management || '',
            mandal: s.mandal || '',
            address: s.address || '',

            chairmanName: s.chairmanName || '',
            chairmanMobile: s.chairmanMobile || '',
            headName: s.headName || '',
            headPhone: s.headPhone || '',
            altPhone: s.altPhone || '',
            principalEmail: s.principalEmail || '',
            instiEmail: s.email || '',
            coordinatorName: s.coordinatorName || '',
            coordinatorMobile: s.coordinatorMobile || '',

            mouStatus: s.mouStatus || 'PENDING',
            mouStart: s.mouStart || '',
            mouEnd: s.mouEnd || '',
            enrollmentEstimate: s.enrollmentEstimate || '',
            notes: s.notes || '',
            staffCount: String(s.staffCount || ''),
            studentCount: String(s.studentCount || ''),
            totalClasses: String(s.totalClasses || ''),
            feesCollected: String(s.feesCollected || ''),
            recentUpdates: s.recentUpdates || '',

            // Required by schema but allow empty if not provided in this context
            studentName: 'School Entry',
            fatherName: '',
            dob: '',
            className: '',
            aadharNo: '',
            phoneNo: '',
            studentSignature: '',
            principalSignature: '',
            seal: '',
        }));

        // Use createMany for efficiency
        const result = await prisma.studentAdmission.createMany({
            data: validatedEntries,
            skipDuplicates: false,
        });

        return NextResponse.json({
            success: true,
            count: result.count,
            message: `${result.count} students registered successfully`
        }, { status: 201 });

    } catch (error) {
        console.error('Bulk Submission Error:', error);
        return NextResponse.json({ error: 'Failed to process bulk registration' }, { status: 500 });
    }
}
