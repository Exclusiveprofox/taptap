// app/admin/layout.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import { headers } from 'next/headers';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = headers();
    const host = headersList.get('host') || '';
    const isLocalhost = host.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';
    const isAuthorized = isLocalhost && isAdminAccessEnabled;

    if (!isAuthorized) {
        return <div className="text-white">Unauthorized</div>;
    }
    return (
        <>
            {children}
        </>
    );
}
