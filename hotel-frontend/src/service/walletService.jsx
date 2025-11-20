import { get, post, patch } from "@/utils/request";
import { toast } from "sonner";

export const getMyWallet = async () => {
  try {
    const res = await get("wallet/my-wallet");
    return res.result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getWithdrawalHistory = async () => {
  try {
    const res = await get("wallet/history");
    return res.result || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const requestWithdrawal = async (data) => {
  try {
    const res = await post("wallet/withdraw", data);
    return res.result;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to request withdrawal");
    throw error;
  }
};

export const getWithdrawalRequests = async () => {
  try {
    const res = await get("wallet/admin/requests");
    return res.result || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const approveWithdrawal = async (id) => {
  try {
    const res = await patch(`wallet/admin/requests/${id}/approve`);
    return res.result;
  } catch (error) {
    toast.error("Failed to approve");
    throw error;
  }
};

export const rejectWithdrawal = async (id) => {
  try {
    const res = await patch(`wallet/admin/requests/${id}/reject`);
    return res.result;
  } catch (error) {
    toast.error("Failed to reject");
    throw error;
  }
};