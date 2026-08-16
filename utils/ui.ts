// utils/ui.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

export const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
};

export const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


type TelegramWindow = Window & typeof globalThis & {
    Telegram?: {
        WebApp?: {
            HapticFeedback: {
                impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
            };
        };
    };
};

export function triggerHapticFeedback(
    telegramWebApp: TelegramWindow | Window = window,
    style: 'light' | 'medium' | 'heavy' = 'medium'
) {
    if (!telegramWebApp) return;

    const vibrationEnabled = localStorage.getItem('vibrationEnabled') !== 'false';
    if (!vibrationEnabled) return;

    const hapticFeedback = (telegramWebApp as TelegramWindow).Telegram?.WebApp?.HapticFeedback;
    if (hapticFeedback?.impactOccurred) {
        hapticFeedback.impactOccurred(style);
    }
}
