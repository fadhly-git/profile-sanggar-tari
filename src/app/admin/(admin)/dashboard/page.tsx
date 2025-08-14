import React from 'react';
import { Metadata } from 'next';
import { getDashboardData } from '@/lib/actions/dashboard';
import DashboardPage from '@/components/admin/dashboard/dashboard-page';

export const metadata: Metadata = {
  title: 'Dashboard - Sanggar',
  description: 'Dashboard admin sanggar',
};

export default async function Dashboard() {
  const dashboardData = await getDashboardData();

  return <DashboardPage dashboardData={dashboardData} />;
}