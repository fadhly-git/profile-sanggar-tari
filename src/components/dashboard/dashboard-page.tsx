'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ExtendedDashboardData } from '@/types/dashboard';
import StatsCards from '@/components/dashboard/stats-card';
import RecentArticles from '@/components/dashboard/recent-article';
import TodaySchedule from '@/components/dashboard/today-schedule';
import { type User } from "@/types"
import { getInitialName } from "@/lib/utils"
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface DashboardPageProps {
    dashboardData: ExtendedDashboardData;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ dashboardData }) => {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        setLastUpdated(new Date().toLocaleTimeString('id-ID'));
    }, []);
    const { data: session } = useSession();
    const user: User | undefined = session?.user
        ? {
            id: (session.user as { id?: string })?.id ?? "",
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            password: "",
            role: Role.ADMIN, // Set a default role; adjust as needed
            createdAt: new Date(),
            updatedAt: new Date(),
            articles: [],
            galleryItems: [],
            scheduleEvents: [],
        }
        : undefined;

    const initialName = getInitialName(user);
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen">
            <Head>
                <title>Dashboard - Sanggar</title>
                <meta name="description" content="Dashboard admin sanggar" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header */}
            <header className="shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard Sanggar</h1>
                            <p className="text-foreground mt-1">{currentDate}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-2 text-sm">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Online
                                </div>
                            </div>
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                                <span className="mr-2">+</span>
                                Tambah Konten
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {initialName ? initialName : "?"}
                                </div>
                                <span className="hidden sm:block font-medium">{user?.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Ringkasan Hari Ini</h2>
                    <StatsCards
                        stats={dashboardData.stats}
                        articlesByStatus={dashboardData.articlesByStatus}
                        galleryByType={{
                            images: dashboardData.galleryByType.image ?? 0,
                            videos: dashboardData.galleryByType.video ?? 0
                        }}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Recent Articles */}
                    <div className="lg:col-span-2">
                        <RecentArticles articles={dashboardData.recentArticles} />
                    </div>

                    {/* Today's Schedule */}
                    <div className="lg:col-span-1">
                        <TodaySchedule events={dashboardData.todayEvents} />
                    </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Messages Card */}
                    <Card className="rounded-xl shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between mb-0 pb-0">
                            <CardTitle className="text-lg font-semibold">Pesan Terbaru</CardTitle>
                            <span className="text-sm">{dashboardData.recentMessages.length} pesan</span>
                        </CardHeader>
                        <CardContent>
                            {dashboardData.recentMessages.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">📭</div>
                                    <p className="">Belum ada pesan baru</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dashboardData.recentMessages.slice(0, 3).map((message) => (
                                        <div key={message.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                            <div className={`w-3 h-3 rounded-full mt-2 ${!message.isRead ? 'bg-red-500' : ''}`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{message.name}</p>
                                                <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(message.createdAt).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats Card */}
                    <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-xl shadow-sm text-white">
                        <CardHeader className="flex flex-row items-center justify-between mb-0 pb-0">
                            <CardTitle className="text-lg font-semibold">Statistik Mingguan</CardTitle>
                            <div className="text-2xl">📊</div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100">Events minggu ini</span>
                                    <span className="text-xl font-bold">{dashboardData.thisWeekEvents}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100">Artikel published</span>
                                    <span className="text-xl font-bold">{dashboardData.articlesByStatus.published}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100">Total galeri</span>
                                    <span className="text-xl font-bold">{dashboardData.stats.totalGalleryItems}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-4 pt-4 border-t border-blue-400">
                            <p className="text-sm text-blue-100">
                                Last updated: {lastUpdated}
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;