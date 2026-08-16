// components/Settings.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/utils/game-mechanics';
import IceCubes from '@/icons/IceCubes';
import { useToast } from '@/contexts/ToastContext';
import Toggle from '@/components/Toggle';
import { triggerHapticFeedback } from '@/utils/ui';

interface SettingsProps {
    setCurrentView: (view: string) => void;
}

export default function Settings({ setCurrentView }: SettingsProps) {
    const showToast = useToast();
    const { pointsBalance } = useGameStore();

    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [animationEnabled, setAnimationEnabled] = useState(true);

    useEffect(() => {
        const storedVibration = localStorage.getItem('vibrationEnabled');
        const storedAnimation = localStorage.getItem('animationEnabled');

        setVibrationEnabled(storedVibration !== 'false');
        setAnimationEnabled(storedAnimation !== 'false');
    }, []);

    const handleVibrationToggle = () => {
        const newValue = !vibrationEnabled;
        if (vibrationEnabled) {
            triggerHapticFeedback(window);
        }
        setVibrationEnabled(newValue);
        localStorage.setItem('vibrationEnabled', newValue.toString());
        showToast(newValue ? 'Vibration enabled' : 'Vibration disabled', 'success');
    };

    const handleAnimationToggle = () => {
        triggerHapticFeedback(window);
        const newValue = !animationEnabled;
        setAnimationEnabled(newValue);
        localStorage.setItem('animationEnabled', newValue.toString());
        showToast(newValue ? 'Animation enabled' : 'Animation disabled', 'success');
    };

    const handleBackToGame = () => {
        triggerHapticFeedback(window);
        setCurrentView('game');
    };

    return (
        <div className="bg-black flex justify-center min-h-screen">
            <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl">
                <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                    <div className="mt-[2px] bg-[#1d2025] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
                        <div className="px-4 pt-1 pb-24">
                            <h1 className="text-2xl text-center mt-4">Settings</h1>

                            <div className="bg-[#272a2f] rounded-lg p-4 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p>Touch vibration</p>
                                    <Toggle enabled={vibrationEnabled} setEnabled={handleVibrationToggle} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Floating points animation</p>
                                    <Toggle enabled={animationEnabled} setEnabled={handleAnimationToggle} />
                                </div>
                            </div>

                            <button
                                onClick={handleBackToGame}
                                className="mx-auto block mt-4 text-center text-[#f3ba2f]"
                            >
                                Back to Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}