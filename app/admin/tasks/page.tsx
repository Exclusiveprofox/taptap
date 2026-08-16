// app/admin/tasks/page.tsx

/**
 * Copyright (c) 2026 Anton Gurov
 *
 * Гайд по созданию такого приложения — на Тоша.pro:
 * https://tosha.pro/articles/telegram-mini-app-polnyy-gayd-po-sozdaniyu-web-app-s-nulya
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskType } from '@prisma/client';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import IceCube from '@/icons/IceCube';
import { formatNumber } from '@/utils/ui';
import { imageMap } from '@/images';
import { useToast } from '@/contexts/ToastContext';

interface ExtendedTask extends Task {
    taskData: {
        link?: string;
        chatId?: string;
        friendsNumber?: number;
    };
}

const taskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    description: z.string().min(1, "Description is required").max(200, "Description must be 200 characters or less"),
    points: z.number().min(0, "Points must be a positive number").nullable(),
    type: z.nativeEnum(TaskType),
    category: z.string().min(1, "Category is required"),
    image: z.string().min(1, "Image is required"),
    callToAction: z.string().min(1, "Call to action is required"),
    isActive: z.boolean(),
    taskData: z.object({
        link: z.string().url("Link must be a valid URL").optional(),
        chatId: z.string().optional(),
        friendsNumber: z.number().int("Number of friends must be an integer").positive("Number of friends must be positive").nullable().optional(),
    }),
}).refine((data) => {
    if (data.type === TaskType.VISIT) {
        return !!data.taskData.link;
    }
    if (data.type === TaskType.TELEGRAM) {
        return !!data.taskData.link && !!data.taskData.chatId;
    }
    if (data.type === TaskType.REFERRAL) {
        return !!data.taskData.friendsNumber;
    }
    return true;
}, {
    message: "Invalid task data for the selected task type",
    path: ["taskData"],
});

type TaskFormData = z.infer<typeof taskSchema>;

const DEFAULT_FORM_VALUES: Partial<TaskFormData> = {
    title: '',
    description: '',
    points: null,
    type: TaskType.VISIT,
    category: '',
    image: '',
    callToAction: '',
    isActive: true,
    taskData: {
        link: '',
        chatId: '',
        friendsNumber: null
    },
};

export default function AdminTasks() {
    const showToast = useToast();
    const [tasks, setTasks] = useState<ExtendedTask[]>([]);
    const [editingTask, setEditingTask] = useState<ExtendedTask | null>(null);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: DEFAULT_FORM_VALUES,
    });

    const taskType = watch("type");
    const imageValue = watch("image");

    const fetchTasks = useCallback(async () => {
        setIsLoadingTasks(true);
        try {
            const response = await fetch('/api/admin/tasks');
            const data = await response.json();
            setTasks(data);

            const uniqueCategories = Array.from(new Set(data.map((task: Task) => task.category))) as string[];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoadingTasks(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, []);

    const onSubmit = async (data: TaskFormData) => {
        try {
            if (editingTask) {
                await fetch(`/api/admin/tasks/${editingTask.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                showToast('Task updated successfully!', 'success');
            } else {
                await fetch('/api/admin/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                showToast('Task created successfully!', 'success');
            }
            setEditingTask(null);
            reset(DEFAULT_FORM_VALUES);
            fetchTasks();
        } catch (error) {
            console.error('Error saving task:', error);
            if (error instanceof Error) {
                showToast(`Failed to save task: ${error.message}`, 'error');
            } else {
                showToast('Failed to save task. Please try again.', 'error');
            }
        }
    };

    const handleCategoryClick = (category: string) => {
        setValue("category", category);
    };

    const handleImageClick = (imageName: string) => {
        setValue("image", imageName);
    };

    const handleEdit = (task: ExtendedTask) => {
        setEditingTask(task);
        reset(task);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        reset(DEFAULT_FORM_VALUES);
    };

    return (
        <div className="bg-[#1d2025] text-white min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-[#f3ba2f]">Manage Tasks</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mb-12 bg-[#272a2f] rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <input
                                {...register("title")}
                                placeholder="Title"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                maxLength={100}
                                autoComplete="off"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <input
                                {...register("description")}
                                placeholder="Description"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                maxLength={200}
                                autoComplete="off"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div>
                            <input
                                type="number"
                                {...register("points", { valueAsNumber: true })}
                                placeholder="Points"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                autoComplete="off"
                            />
                            {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points.message}</p>}
                        </div>

                        <div>
                            <select
                                {...register("type")}
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                            >
                                {Object.values(TaskType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                        </div>

                        <div>
                            <input
                                {...register("category")}
                                placeholder="Category"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg mb-2"
                                autoComplete="off"
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => handleCategoryClick(category)}
                                        className="px-2 py-1 bg-[#3a3d42] text-sm rounded hover:bg-[#4a4d52] transition-colors"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <input
                                {...register("image")}
                                placeholder="Image"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg mb-2"
                                autoComplete="off"
                                readOnly
                            />
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(imageMap).map(([name, src]) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => handleImageClick(name)}
                                        className={`p-1 rounded transition-colors ${imageValue === name
                                            ? 'bg-[#f3ba2f] hover:bg-[#f4c141]'
                                            : 'bg-[#3a3d42] hover:bg-[#4a4d52]'
                                            }`}
                                    >
                                        <img
                                            src={src.src}
                                            alt={name}
                                            className="w-8 h-8 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <input
                                {...register("callToAction")}
                                placeholder="Call To Action"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                autoComplete="off"
                            />
                            {errors.callToAction && <p className="text-red-500 text-sm mt-1">{errors.callToAction.message}</p>}
                        </div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="form-checkbox h-5 w-5 text-[#f3ba2f]"
                                autoComplete="off"
                            />
                            <span>Is Active</span>
                        </label>

                        {(taskType === TaskType.VISIT || taskType === TaskType.TELEGRAM) && (
                            <div>
                                <input
                                    {...register("taskData.link")}
                                    placeholder="Link"
                                    className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                    autoComplete="off"
                                />
                                {errors.taskData?.link && <p className="text-red-500 text-sm mt-1">{errors.taskData.link.message}</p>}
                            </div>
                        )}

                        {taskType === TaskType.TELEGRAM && (
                            <div>
                                <input
                                    {...register("taskData.chatId")}
                                    placeholder="Chat ID (e.g., clicker_game_news)"
                                    className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                    autoComplete="off"
                                />
                                {errors.taskData?.chatId && <p className="text-red-500 text-sm mt-1">{errors.taskData.chatId.message}</p>}
                            </div>
                        )}

                        {taskType === TaskType.REFERRAL && (
                            <div>
                                <input
                                    type="number"
                                    {...register("taskData.friendsNumber", { valueAsNumber: true })}
                                    placeholder="Number of Friends"
                                    className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                    autoComplete="off"
                                />
                                {errors.taskData?.friendsNumber && <p className="text-red-500 text-sm mt-1">{errors.taskData.friendsNumber.message}</p>}
                            </div>
                        )}

                        {errors.taskData && !errors.taskData.link && !errors.taskData.chatId && !errors.taskData.friendsNumber && (
                            <p className="text-red-500 text-sm col-span-2 mt-1">{errors.taskData.message}</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        {editingTask && (
                            <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="px-6 py-2 bg-[#f3ba2f] text-black rounded-lg hover:bg-[#f4c141] transition-colors">
                            {editingTask ? 'Update Task' : 'Add Task'}
                        </button>
                    </div>
                </form>

                <div className="bg-[#272a2f] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Existing Tasks ({tasks.length})</h2>
                        <button
                            onClick={fetchTasks}
                            className="p-2 bg-[#3a3d42] rounded-full hover:bg-[#4a4d52] transition-colors"
                        >
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoadingTasks ? (
                            [...Array(6)].map((_, index) => (
                                <div key={index} className="bg-[#3a3d42] rounded-lg p-4 animate-pulse">
                                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                </div>
                            ))
                        ) : tasks.length > 0 ? (
                            tasks.map(task => (
                                <div key={task.id} className="bg-[#3a3d42] rounded-lg p-4 flex flex-col h-full">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                                        <p className="text-gray-400 mb-3">{task.description}</p>
                                        <div className="flex items-center mb-2">
                                            <IceCube className="w-4 h-4 mr-2" />
                                            <span className="text-[#f3ba2f] font-medium">{formatNumber(task.points)}</span>
                                        </div>
                                        <p className="text-sm text-gray-400">Type: {task.type}</p>
                                        <p className="text-sm text-gray-400">Category: {task.category}</p>
                                        <p className="text-sm text-gray-400">Active: {task.isActive ? 'Yes' : 'No'}</p>

                                        {/* Display taskData based on task type */}
                                        {task.type === TaskType.VISIT && task.taskData?.link && (
                                            <p className="text-sm text-gray-400">Link: {task.taskData.link}</p>
                                        )}
                                        {task.type === TaskType.TELEGRAM && (
                                            <>
                                                {task.taskData?.link && <p className="text-sm text-gray-400">Link: {task.taskData.link}</p>}
                                                {task.taskData?.chatId && <p className="text-sm text-gray-400">Chat ID: {task.taskData.chatId}</p>}
                                            </>
                                        )}
                                        {task.type === TaskType.REFERRAL && task.taskData?.friendsNumber && (
                                            <p className="text-sm text-gray-400">Friends Required: {task.taskData.friendsNumber}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="w-full mt-4 px-4 py-2 bg-[#f3ba2f] text-black rounded-lg hover:bg-[#f4c141] transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-400 bg-[#3a3d42] rounded-lg p-8">
                                No tasks available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}