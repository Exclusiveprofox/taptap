// app/api/wallet/connect/route.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';

interface ConnectWalletRequestBody {
    initData: string;
    walletAddress: string;
}

export async function POST(req: Request) {
    const requestBody: ConnectWalletRequestBody = await req.json();
    const { initData: telegramInitData, walletAddress } = requestBody;

    if (!telegramInitData || !walletAddress) {
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
            data: { tonWalletAddress: walletAddress },
        });

        return NextResponse.json({
            success: true,
            message: 'Wallet connected successfully',
            walletAddress: updatedUser.tonWalletAddress,
        });

    } catch (error) {
        console.error('Error connecting wallet:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to connect wallet' }, { status: 500 });
    }
}