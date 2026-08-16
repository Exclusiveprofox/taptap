// app/page.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

'use client'

import Image from 'next/image';
import { mainCharacter } from '@/images';
import IceCube from '@/icons/IceCube';
import Link from 'next/link';

export default function Home() {
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
        
        <h1 className="text-3xl font-bold mb-4">Welcome to TonIce DEMOOOOO</h1>
        
        <p className="text-xl mb-2">The game is on the <Link href="/clicker" className="underline">Clicker</Link> page.</p>
        <p className="text-xl mb-6">Developed by <Link href="https://t.me/exclusiveprofox" target="_blank" className="underline">Anton Gurov</Link>.</p>
        
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
