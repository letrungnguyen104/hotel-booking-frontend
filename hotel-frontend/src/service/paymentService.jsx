import { get } from "@/utils/request";

export const getPaymentHistory = async () => {
  try {
    const res = await get("payments/hotel-admin/history");
    return res.result || [];
  } catch (error) {
    console.error("Failed to fetch payment history:", error);
    return [];
  }
};