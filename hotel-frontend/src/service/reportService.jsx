import { get, patch, post } from '@/utils/request';

export const createReport = async (data) => {
  const response = await post('reports', data);
  return response.result;
};

export const getAllReports = async (status) => {
  const url = status ? `reports/admin?status=${status}` : 'reports/admin';
  const response = await get(url);
  return response.result;
};

export const updateReportStatus = async (reportId, status) => {
  const response = await patch(`reports/admin/${reportId}/status`, { status });
  return response.result;
};