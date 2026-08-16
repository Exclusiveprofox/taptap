// components/Mine.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

'use client'

import { useState } from 'react';
import IceCubes from '@/icons/IceCubes';
import { calculateMineUpgradeCost, calculateProfitPerHour, useGameStore } from '@/utils/game-mechanics';
import Snowflake from '@/icons/Snowflake';
import TopInfoSection from '@/components/TopInfoSection';
import { MAXIMUM_INACTIVE_TIME_FOR_MINE, mineUpgradeBaseBenefit, mineUpgradeBasePrice, mineUpgradeBenefitCoefficient, mineUpgradeCostCoefficient } from '@/utils/consts';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { useToast } from '@/contexts/ToastContext';
import Info from '@/icons/Info';

interface MineProps {
    setCurrentView: (view: string) => void;
}

export default function Mine({ setCurrentView }: MineProps) {
    const showToast = useToast();

    const {
        userTelegramInitData,
        pointsBalance,
        profitPerHour,
        mineLevelIndex,
        upgradeMineLevelIndex
    } = useGameStore();
    const [isLoading, setIsLoading] = useState(false);

    const upgradeCost = calculateMineUpgradeCost(mineLevelIndex);
    const upgradeIncrease = calculateProfitPerHour(mineLevelIndex + 1) - calculateProfitPerHour(mineLevelIndex);

    const maxInactiveHours = MAXIMUM_INACTIVE_TIME_FOR_MINE / (60 * 60 * 1000);

    const handleUpgrade = async () => {
        if (pointsBalance >= upgradeCost && !isLoading) {
            setIsLoading(true);
            try {
                triggerHapticFeedback(window);
                const response = await fetch('/api/upgrade/mine', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        initData: userTelegramInitData,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to upgrade mine');
                }

                const result = await response.json();

                console.log("Result from server:", result);

                // Update local state with the new values
                upgradeMineLevelIndex();

                showToast('Mine Upgrade Successful!', 'success');
            } catch (error) {
                console.error('Error upgrading mine:', error);
                showToast('Failed to upgrade mine. Please try again.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-black flex justify-center min-h-screen">
            <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl">
                <TopInfoSection setCurrentView={setCurrentView} />

                <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                    <div className="mt-[2px] bg-[#1d2025] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
                        <div className="px-4 pt-1 pb-24">
                            <h1 className="text-2xl text-center mt-4">Upgrade Ice Production</h1>

                            <div className="px-4 mt-4 flex justify-center">
                                <div className="px-4 py-2 flex items-center space-x-2">
                                    <IceCubes className="w-12 h-12 mx-auto" />
                                    <p className="text-4xl text-white" suppressHydrationWarning >{Math.floor(pointsBalance).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-[#272a2f] rounded-lg p-4 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p>Current ice per hour:</p>
                                    <p className="text-[#f3ba2f]">{formatNumber(profitPerHour)}</p>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p>Upgrade cost:</p>
                                    <p className="text-[#f3ba2f]">{formatNumber(upgradeCost)}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Ice per hour increase:</p>
                                    <p className="text-[#f3ba2f]">+{formatNumber(upgradeIncrease)}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleUpgrade}
                                disabled={pointsBalance < upgradeCost || isLoading}
                                className={`w-full mt-6 py-3 rounded-lg text-center text-white font-bold ${pointsBalance >= upgradeCost && !isLoading ? 'bg-[#f3ba2f]' : 'bg-gray-500 cursor-not-allowed'
                                    } relative`}
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                ) : (
                                    'Upgrade'
                                )}
                            </button>

                            <div className="bg-[#272a2f] rounded-lg p-4 mt-6 flex items-start">
                                <Info className="w-6 h-6 text-[#f3ba2f] mr-3 flex-shrink-0 mt-1" />
                                <p className="text-sm text-gray-300">
                                    Your mine automatically produces ice for up to <span className="text-white font-bold">{maxInactiveHours} hours</span> after your last activity. Make sure to check in regularly to maximize your ice production!
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}