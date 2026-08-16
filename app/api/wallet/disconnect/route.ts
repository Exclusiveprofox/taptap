// app/api/wallet/disconnect/route.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';

interface DisconnectWalletRequestBody {
    initData: string;
}

export async function POST(req: Request) {
    const requestBody: DisconnectWalletRequestBody = await req.json();
    const { initData: telegramInitData } = requestBody;

    if (!telegramInitData) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { validatedData, user } = validateTelegramWebAppData(telegramInitData);

    if (!validatedData) {
        return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 403 });
    }

    const telegramId = user.id?.toString();

    if (!telegramId) {
        return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { tonWalletAddress: null },
        });

        return NextResponse.json({
            success: true,
            message: 'Wallet disconnected successfully',
        });

    } catch (error) {
        console.error('Error disconnecting wallet:', error);
        return NextResponse.json({ error: 'Failed to disconnect wallet' }, { status: 500 });
    }
}