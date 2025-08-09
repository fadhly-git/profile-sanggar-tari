import React from 'react';
import { DashboardStats } from '@/types/dashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatsCardsProps {
    stats: DashboardStats;
    articlesByStatus?: {
        published: number;
        draft: number;
        archived: number;
    };
    galleryByType?: {
        images: number;
        videos: number;
    };
}

const StatsCards: React.FC<StatsCardsProps> = ({
    stats,
    articlesByStatus,
    galleryByType
}) => {
    const statsData = [
        {
            title: 'Total Artikel',
            value: stats.totalArticles,
            icon: '📰',
            color: 'from-blue-500 to-blue-600',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            subtitle: articlesByStatus ?
                `${articlesByStatus.published} Published, ${articlesByStatus.draft} Draft` :
                undefined
        },
        {
            title: 'Galeri Items',
            value: stats.totalGalleryItems,
            icon: '🖼️',
            color: 'from-green-500 to-green-600',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            subtitle: galleryByType ?
                `${galleryByType.images} Gambar, ${galleryByType.videos} Video` :
                undefined
        },
        {
            title: 'Jadwal Events',
            value: stats.totalEvents,
            icon: '📅',
            color: 'from-yellow-500 to-yellow-600',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            subtitle: 'Events aktif'
        },
        {
            title: 'Pesan Baru',
            value: stats.totalMessages,
            icon: '✉️',
            color: 'from-red-500 to-red-600',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
            subtitle: `${stats.totalMessages} total pesan`
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-sm font-medium mb-1">{stat.title}</CardTitle>
                      <CardDescription>
                        <span className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</span>
                        {stat.subtitle && (
                          <div className="text-xs text-gray-500">{stat.subtitle}</div>
                        )}
                      </CardDescription>
                    </div>
                    <div className={`${stat.bgColor} p-4 rounded-full text-2xl`}>
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`mt-2 h-1 bg-gradient-to-r ${stat.color} rounded-full`}></div>
                  </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsCards;