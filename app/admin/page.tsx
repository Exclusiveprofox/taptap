// app/admin/page.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AdminPanel = () => {
    const router = useRouter();

    const adminSections = [
        { title: 'Manage Tasks', path: '/admin/tasks', description: 'Add, edit, and manage game tasks' },
        { title: 'Export User Data', path: '/admin/export', description: 'Export user information' },
    ];

    return (
        <div className="min-h-screen bg-[#1d2025] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-[#f3ba2f]">Admin Panel</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adminSections.map((section) => (
                        <div
                            key={section.path}
                            className="bg-[#272a2f] rounded-lg p-6 hover:bg-[#3a3d42] transition-colors cursor-pointer"
                            onClick={() => router.push(section.path)}
                        >
                            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                            <p className="text-gray-400 mb-4">{section.description}</p>
                            <Link
                                href={section.path}
                                className="inline-block bg-[#f3ba2f] text-black px-4 py-2 rounded-lg hover:bg-[#f4c141] transition-colors"
                            >
                                Go to {section.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;