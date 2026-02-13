import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const events = await prisma.calendarEvent.findMany({
            orderBy: { date: 'asc' },
        });
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, date, description } = body;

        if (!title || !date) {
            return NextResponse.json({ error: 'Title and Date are required' }, { status: 400 });
        }

        const event = await prisma.calendarEvent.create({
            data: {
                title,
                date,
                description,
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.calendarEvent.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
