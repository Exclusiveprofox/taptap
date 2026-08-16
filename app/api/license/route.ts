// app/api/license/route.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import { NextResponse } from 'next/server';

const licenseInfo = `
Copyright (c) 2026 Anton Gurov.

Гайд по созданию такого приложения — на Тоша.pro:
https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
`;

export async function GET(req: Request) {
  return NextResponse.json({
    license: licenseInfo.trim(),
    version: '1.0.0',
    lastUpdated: '2026-08-16'
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}