import React from 'react';
import { TodayEvent } from '@/types/dashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton';

interface TodayScheduleProps {
  events: TodayEvent[];
  loading?: boolean;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ events, loading = false }) => {
  const formatTime = (date: Date | string) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start space-x-4 py-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jadwal Hari Ini</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📅</div>
            <p>Tidak ada jadwal hari ini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-start space-x-4 py-3 hover:bg-primary/90 rounded-lg px-3 -mx-3">
                <div className="p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium mb-1">{event.title}</CardTitle>
                  <CardDescription className="text-xs mb-2">{event.description}</CardDescription>
                  <div className="flex items-center text-xs space-x-4">
                    <span>⏰ {formatTime(event.startDate)} - {event.endDate ? formatTime(event.endDate) : 'Selesai'}</span>
                    {event.location && <span>📍 {event.location}</span>}
                    {event.isRecurring && (
                      <span className="px-2 py-1 rounded-full">
                        Berulang
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;