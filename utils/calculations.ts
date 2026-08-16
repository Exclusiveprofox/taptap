// utils/calculations.ts

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

export const calculateUpgradeCost = (levelIndex: number, basePrice: number, coefficient: number): number => {
    return Math.floor(basePrice * Math.pow(coefficient, levelIndex));
}

export const calculateUpgradeBenefit = (levelIndex: number, baseBenefit: number, coefficient: number): number => {
    let benefit = 0;
    for (let i = 0; i <= levelIndex; i++) {
        benefit += Math.floor(baseBenefit * Math.pow(coefficient, i));
    }
    return benefit;
}