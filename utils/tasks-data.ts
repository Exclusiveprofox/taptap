/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */


export const earnData = [
    {
      category: "Ice Youtube",
      tasks: [
        {
          title: "Set Up Telegram Mini App Clicker Game",
          points: 5000,
          image: "youtube",
          description: "In this guide, I'll show you how to set up a Next.js 14 project as a Telegram Mini App clicker game.",
          callToAction: "Watch video",
          type: "VISIT",
          taskData: {
            link: "https://youtu.be/OYcqPL1HSTo?si=Fc2zb4lS0d7VUHlR"
          },
          isActive: true  
        },
        {
          title: "How to Make a Hamster Kombat Clone",
          points: 5000,
          image: "youtube",
          description: "In this video, you'll be guided through the process of creating a clone of the famous Hamster Kombat app.",
          callToAction: "Watch video",
          type: "VISIT",
          taskData: {
            link: "https://youtu.be/luAn3BlI4go?si=nKvs72-7_WVItXZo"
          },
          isActive: true  
        },
        {
          title: "How to Make a Notcoin Clone",
          points: 5000,
          image: "youtube",
          description: "In this video, you'll be guided through the process of creating a clone of the famous Notcoin app.",
          callToAction: "Watch video",
          type: "VISIT",
          taskData: {
            link: "https://youtu.be/TxArGoG9YMA?si=iYofFT70PKuAMnrV"
          },
          isActive: true  
        },
      ]
    },
    {
      category: "Tasks list",
      tasks: [
        {
          title: "Join Clicker Game News / Updates",
          points: 5000,
          image: "telegram",
          description: "Stay updated with the latest news and announcements by joining Clicker News Telegram channel.",
          callToAction: "Join channel",
          type: "TELEGRAM",
          taskData: {
            link: "https://t.me/clicker_game_news",
            chatId: "clicker_game_news"
          },
          isActive: true  
        },
        {
          title: "Read the app guide on Тоша.pro",
          points: 5000,
          image: "twitter",
          description: "Хочешь узнать, как сделано это приложение? Полный гайд по созданию Telegram Mini App — на Тоша.pro.",
          callToAction: "Читать гайд",
          type: "VISIT",
          taskData: {
            link: "https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya"
          },
          isActive: true
        },
        {
          title: "Invite 3 friends",
          points: 25000,
          image: "friends",
          description: "Invite your friends to join the Ice community and earn bonus points for each successful referral.",
          callToAction: "Invite friends",
          type: "REFERRAL",
          taskData: {
            friendsNumber: 3
          },
          isActive: true  
        }
      ]
    },
  ];