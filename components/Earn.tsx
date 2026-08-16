// components/Earn.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import IceCube from '@/icons/IceCube';
import { useGameStore } from '@/utils/game-mechanics';
import { capitalizeFirstLetter, formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { imageMap } from '@/images';
import Time from '@/icons/Time';
import TaskPopup from './popups/TaskPopup';
import { Task } from '@/utils/types';

const TaskSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {[...Array(3)].map((_, categoryIndex) => (
      <div key={categoryIndex}>
        {/* Category title skeleton */}
        <div className="h-5 bg-gray-700 rounded w-32 mb-4"></div>

        {/* Tasks skeleton */}
        <div className="space-y-2">
          {[...Array(3)].map((_, taskIndex) => (
            <div
              key={taskIndex}
              className="flex justify-between items-center bg-[#272a2f] rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                {/* Task image skeleton */}
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div className="space-y-2">
                  {/* Task title skeleton */}
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  {/* Points skeleton */}
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const useFetchTasks = (userTelegramInitData: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?initData=${encodeURIComponent(userTelegramInitData)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userTelegramInitData]);

  return { tasks, setTasks, isLoading };
};

export default function Earn() {
  const { userTelegramInitData } = useGameStore();
  const { tasks, setTasks, isLoading } = useFetchTasks(userTelegramInitData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskSelection = useCallback((task: Task) => {
    if (!task.isCompleted) {
      triggerHapticFeedback(window);
      setSelectedTask(task);
    }
  }, []);

  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === updatedTask.id ? updatedTask : t
      )
    );
  }, [setTasks]);

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="mt-[2px] bg-[#1d2025] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
            <div className="px-4 pt-1 pb-24">
              <div className="relative mt-4">
                <div className="flex justify-center mb-4">
                  <IceCube className="w-24 h-24 mx-auto" />
                </div>
                <h1 className="text-2xl text-center mb-4">Earn More Ice</h1>

                {isLoading ? (
                  <TaskSkeleton />
                ) : (
                  Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                    <div key={category}>
                      <h2 className="text-base mt-8 mb-4">{capitalizeFirstLetter(category)}</h2>
                      <div className="space-y-2">
                        {categoryTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex justify-between items-center bg-[#272a2f] rounded-lg p-4 cursor-pointer"
                            onClick={() => handleTaskSelection(task)}
                          >
                            <div className="flex items-center">
                              <Image src={imageMap[task.image]} alt={task.title} width={40} height={40} className="rounded-lg mr-2" />
                              <div className="flex flex-col">
                                <span className="font-medium">{task.title}</span>
                                <div className="flex items-center">
                                  <IceCube className="w-6 h-6 mr-1" />
                                  <span className="text-white">+{formatNumber(task.points)}</span>
                                </div>
                              </div>
                            </div>
                            {task.isCompleted ? (
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : task.taskStartTimestamp ? (
                              <span className="text-yellow-500"><Time /></span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}