// app/api/admin/export/route.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { User } from '@prisma/client';

const PAGE_SIZE = 100000; // Adjust based on your needs and server capabilities

export async function POST(req: NextRequest) {
    const isLocalhost = req.headers.get('host')?.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';

    if (!isLocalhost || !isAdminAccessEnabled) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { fields, page = 0 } = await req.json() as { fields: (keyof User)[], page?: number };

        const users = await prisma.user.findMany({
            select: fields.reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {} as { [K in keyof User]?: true }),
            skip: page * PAGE_SIZE,
            take: PAGE_SIZE,
        });

        const totalUsers = await prisma.user.count();
        const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

        return NextResponse.json({
            users,
            page,
            totalPages,
            hasMore: page < totalPages - 1
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}