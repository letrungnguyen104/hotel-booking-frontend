// src/service/bookingService.js
import { get, patch, post } from '@/utils/request';

export const createBooking = async (data) => {
  const response = await post('bookings/create-payment', data);
  return response.result;
};

export const retryBookingPayment = async (bookingId) => {
  console.log(`bookings/retry-payment/${bookingId}`);
  const response = await post(`bookings/retry-payment/${bookingId}`);
  return response.result;
};

export const getMyBookings = async () => {
  const response = await get('bookings/my-bookings');
  return response.result;
};

export const cancelBooking = async (bookingId, reason) => {
  const response = await patch(`bookings/cancel/${bookingId}`, { reason });
  return response.result;
};

export const approveCancellation = async (bookingId) => {
  const response = await patch(`bookings/hotel-admin/approve-cancellation/${bookingId}`);
  return response.result;
};

export const rejectCancellation = async (bookingId) => {
  const response = await patch(`bookings/hotel-admin/reject-cancellation/${bookingId}`);
  return response.result;
};

export const getBookingsForHotelAdmin = async (status) => {
  const url = status ? `bookings/hotel-admin?status=${status}` : 'bookings/hotel-admin';
  const response = await get(url);
  return response.result;
};

export const confirmBooking = async (bookingId) => {
  const response = await patch(`bookings/hotel-admin/confirm/${bookingId}`);
  return response.result;
};

export const checkInBooking = async (bookingId) => {
  const response = await patch(`bookings/hotel-admin/check-in/${bookingId}`);
  return response.result;
};

export const checkOutBooking = async (bookingId) => {
  const response = await patch(`bookings/hotel-admin/check-out/${bookingId}`);
  return response.result;
};

export const createReview = async (data) => {
  const response = await post('reviews', data);
  return response.result;
};

export const getReviewsByHotelId = async (hotelId) => {
  const response = await get(`reviews/hotel/${hotelId}`);
  return response.result;
};

export const getDashboardData = async (startDate, endDate) => {
  const response = await get(`bookings/hotel-admin/dashboard?startDate=${startDate}&endDate=${endDate}`);
  return response.result;
};