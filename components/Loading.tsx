// components/Loading.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { botUrlQr, mainCharacter } from '@/images';
import IceCube from '@/icons/IceCube';
import { calculateEnergyLimit, calculateLevelIndex, calculatePointsPerClick, calculateProfitPerHour, GameState, InitialGameState, useGameStore } from '@/utils/game-mechanics';
import WebApp from '@twa-dev/sdk';
import UAParser from 'ua-parser-js';
import { ALLOW_ALL_DEVICES } from '@/utils/consts';

interface LoadingProps {
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentView: (view: string) => void;
}

export default function Loading({ setIsInitialized, setCurrentView }: LoadingProps) {
  const initializeState = useGameStore((state: GameState) => state.initializeState);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const openTimestampRef = useRef(Date.now());
  const [isAppropriateDevice, setIsAppropriateDevice] = useState(true);


  const fetchOrCreateUser = useCallback(async () => {
    try {
      let initData, telegramId, username, telegramName, startParam;

      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        WebApp.bottomBarColor = "#1d2025";
        WebApp.headerColor = "#000000";
        WebApp.enableVerticalSwipes();
        WebApp.expand();
        initData = WebApp.initData;
        telegramId = WebApp.initDataUnsafe.user?.id.toString();
        username = WebApp.initDataUnsafe.user?.username || 'Unknown User';
        telegramName = WebApp.initDataUnsafe.user?.first_name || 'Unknown User';

        startParam = WebApp.initDataUnsafe.start_param;
      }


      const referrerTelegramId = startParam ? startParam.replace('kentId', '') : null;

      if (process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH === 'true') {
        initData = "temp";
      }
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramInitData: initData,
          referrerTelegramId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch or create user');
      }
      const userData = await response.json();

      console.log("user data: ", userData);

      // Check if initData and telegramName are defined
      if (!initData) {
        throw new Error('initData is undefined');
      }
      if (!telegramName) {
        throw new Error('telegramName is undefined');
      }

      // Create the game store with fetched data
      const initialState: InitialGameState = {
        userTelegramInitData: initData,
        userTelegramName: telegramName,
        lastClickTimestamp: userData.lastPointsUpdateTimestamp,
        gameLevelIndex: calculateLevelIndex(userData.points),
        points: userData.points,
        pointsBalance: userData.pointsBalance,
        unsynchronizedPoints: 0,
        multitapLevelIndex: userData.multitapLevelIndex,
        pointsPerClick: calculatePointsPerClick(userData.multitapLevelIndex),
        energy: userData.energy,
        maxEnergy: calculateEnergyLimit(userData.energyLimitLevelIndex),
        energyRefillsLeft: userData.energyRefillsLeft,
        energyLimitLevelIndex: userData.energyLimitLevelIndex,
        lastEnergyRefillTimestamp: userData.lastEnergyRefillsTimestamp,
        mineLevelIndex: userData.mineLevelIndex,
        profitPerHour: calculateProfitPerHour(userData.mineLevelIndex),
        tonWalletAddress: userData?.tonWalletAddress,
      };

      console.log("Initial state: ", initialState);

      initializeState(initialState);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., show error message to user)
    }
  }, [initializeState]);

  useEffect(() => {
    const parser = new UAParser();
    const device = parser.getDevice();
    const isAppropriate = ALLOW_ALL_DEVICES || device.type === 'mobile' || device.type === 'tablet';
    setIsAppropriateDevice(isAppropriate);

    if (isAppropriate) {
      fetchOrCreateUser();
    }
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - openTimestampRef.current;
      const remainingTime = Math.max(3000 - elapsedTime, 0);

      const timer = setTimeout(() => {
        setCurrentView('game');
        setIsInitialized(true);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isDataLoaded, setIsInitialized, setCurrentView]);

  if (!isAppropriateDevice) {
    return (
      <div className="bg-[#1d2025] flex justify-center items-center h-screen">
        <div className="w-full max-w-xl text-white flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Play on your mobile</h1>
          <Image
            className="bg-white p-2 rounded-xl"
            src={botUrlQr}
            alt="QR Code"
            width={200}
            height={200}
          />
          <p className="mt-4">@{process.env.NEXT_PUBLIC_BOT_USERNAME}</p>
          <p className="mt-2">
            Developed by Anton Gurov —{' '}
            <a href="https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya" target="_blank" rel="noopener noreferrer" className="underline">
              гайд на Тоша.pro
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1d2025] flex justify-center items-center h-screen">
      <div className="w-full max-w-xl text-white flex flex-col items-center">
        <div className="w-64 h-64 rounded-full circle-outer p-2 mb-8">
          <div className="w-full h-full rounded-full circle-inner overflow-hidden relative">
            <Image
              src={mainCharacter}
              alt="Main Character"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transform: 'scale(1.05) translateY(10%)'
              }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Loading Ton Ice</h1>

        <div className="flex items-center space-x-2">
          <IceCube className="w-8 h-8 animate-pulse" />
          <IceCube className="w-8 h-8 animate-pulse delay-100" />
          <IceCube className="w-8 h-8 animate-pulse delay-200" />
        </div>
      
      <iframe src="https://zerads.com/ad/ad.php?width=728&ref=10853"  width="728" height="90" scrolling="no" ></iframe>
        <iframe src="https://zerads.com/ad/ad.php?width=728&ref=10853"  width="728" height="90" scrolling="no" ></iframe>
        <iframe src="https://zerads.com/ad/ad.php?width=728&ref=10853"  width="728" height="90" scrolling="no" ></iframe>
        <iframe src="https://zerads.com/ad/ad.php?width=728&ref=10853"  width="728" height="90" scrolling="no" ></iframe>
      </div>
      
    </div>
  );
}