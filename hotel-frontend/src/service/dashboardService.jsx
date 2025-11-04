// src/service/dashboardService.js
import { get } from '@/utils/request';

export const getAdminDashboardData = async (startDate, endDate) => {
  const response = await get(`dashboard/admin?startDate=${startDate}&endDate=${endDate}`);
  return response.result;
};