import { get, post } from "@/utils/request";
import { toast } from "sonner";

export const getAllInquiries = async () => {
  try {
    const res = await get("inquiries/admin");
    return res.result || [];
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    toast.error(error.response?.data?.message || "Failed to fetch inquiries");
    return [];
  }
};

export const replyToInquiry = async (inquiryId, replyMessage) => {
  try {
    const res = await post(`inquiries/admin/${inquiryId}/reply`, {
      reply: replyMessage,
    });
    return res.result;
  } catch (error) {
    console.error("Failed to reply to inquiry:", error);
    toast.error(error.response?.data?.message || "Failed to send reply");
    return null;
  }
};