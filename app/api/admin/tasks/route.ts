// app/api/admin/tasks/route.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest) {
    const isLocalhost = req.headers.get('host')?.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';

    if (!isLocalhost || !isAdminAccessEnabled) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
    const isLocalhost = req.headers.get('host')?.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';

    if (!isLocalhost || !isAdminAccessEnabled) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const taskData = await req.json();
    const task = await prisma.task.create({ data: taskData });
    return NextResponse.json(task);
}