// app/admin/export/page.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

'use client';

import { useState, useMemo } from 'react';
import { User } from '@prisma/client';

type FieldName = Exclude<keyof User, 'id' | 'referrals' | 'referredBy' | 'referredById' | 'completedTasks'>;

type FieldsState = {
    [K in FieldName]: boolean;
};

const userFields: FieldName[] = [
    'telegramId',
    'name',
    'isPremium',
    'points',
    'pointsBalance',
    'multitapLevelIndex',
    'energy',
    'energyRefillsLeft',
    'energyLimitLevelIndex',
    'mineLevelIndex',
    'lastPointsUpdateTimestamp',
    'lastEnergyUpdateTimestamp',
    'lastEnergyRefillsTimestamp',
    'tonWalletAddress',
    'referralPointsEarned',
    'offlinePointsEarned'
];

const createInitialFieldsState = (): FieldsState => {
    return userFields.reduce((acc, field) => {
        acc[field] = false;
        return acc;
    }, {} as FieldsState);
};

export default function AdminExport() {
    const [fields, setFields] = useState<FieldsState>(createInitialFieldsState());
    const [isLoading, setIsLoading] = useState(false);

    const isAnyFieldSelected = useMemo(() => {
        return Object.values(fields).some(value => value);
    }, [fields]);

    const handleFieldChange = (field: FieldName) => {
        setFields(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSelectAll = () => {
        setFields(prev => Object.keys(prev).reduce((acc, key) => {
            acc[key as FieldName] = true;
            return acc;
        }, {} as FieldsState));
    };

    const handleDeselectAll = () => {
        setFields(createInitialFieldsState());
    };

    const handleDownload = async () => {
        setIsLoading(true);
        const selectedFields = Object.entries(fields)
            .filter(([_, value]) => value)
            .map(([key]) => key as FieldName);

        // Create a type for the user data based on selected fields
        type SelectedUserData = Pick<User, typeof selectedFields[number]>;

        try {
            let allUsers: SelectedUserData[] = [];
            let page = 0;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch('/api/admin/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fields: selectedFields, page }),
                });

                if (!response.ok) {
                    throw new Error('Export failed');
                }

                const data: { users: SelectedUserData[], hasMore: boolean } = await response.json();
                allUsers = allUsers.concat(data.users);
                hasMore = data.hasMore;
                page++;
            }

            const blob = new Blob([JSON.stringify(allUsers, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'users_export.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#1d2025] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-[#f3ba2f]">Export Info</h1>
                <div className="bg-[#272a2f] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Select fields to export:</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        {userFields.map((field) => (
                            <div key={field} className="flex items-center">
                                <div className="w-5 h-5 mr-2 flex-shrink-0 relative">
                                    <input
                                        id={field}
                                        type="checkbox"
                                        checked={fields[field]}
                                        onChange={() => handleFieldChange(field)}
                                        className="w-full h-full rounded border-2 border-gray-400 
                               appearance-none cursor-pointer
                               checked:bg-[#f3ba2f] checked:border-[#f3ba2f]
                               transition-colors duration-200 ease-in-out"
                                    />
                                    <svg
                                        className="absolute w-4 h-4 top-0.5 left-0.5 pointer-events-none hidden checked:block stroke-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <label htmlFor={field} className="text-sm cursor-pointer truncate">{field}</label>
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSelectAll}
                            className="bg-[#3a3d42] text-white px-4 py-2 rounded hover:bg-[#4a4d52] transition-colors"
                        >
                            Select All
                        </button>
                        <button
                            onClick={handleDeselectAll}
                            className="bg-[#3a3d42] text-white px-4 py-2 rounded hover:bg-[#4a4d52] transition-colors"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleDownload}
                    disabled={isLoading || !isAnyFieldSelected}
                    className={`bg-[#f3ba2f] text-black px-6 py-3 rounded-lg font-bold text-lg transition-colors 
                     ${isLoading || !isAnyFieldSelected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f4c141]'}`}
                >
                    {isLoading ? 'Exporting...' : 'Export JSON'}
                </button>
            </div>
        </div>
    );
}