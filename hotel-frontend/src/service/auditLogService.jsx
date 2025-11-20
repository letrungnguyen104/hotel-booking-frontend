import { get } from "@/utils/request";
import { toast } from "sonner";

export const getAllAuditLogs = async () => {
  try {
    const res = await get("audit-logs");
    return res.result || [];
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    toast.error("Failed to load system logs");
    return [];
  }
};