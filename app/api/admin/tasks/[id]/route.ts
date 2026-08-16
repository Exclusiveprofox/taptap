// app/api/admin/tasks/[id]/route.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const isLocalhost = req.headers.get('host')?.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';

    if (!isLocalhost || !isAdminAccessEnabled) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const taskData = await req.json();

        // Remove the id from the taskData
        const { id, ...updateData } = taskData;

        const task = await prisma.task.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Update task error:', error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}