const BANK_API_URL = "https://api.vietqr.io/v2/banks";

export const getBankList = async () => {
  try {
    const response = await fetch(BANK_API_URL);
    const data = await response.json();

    console.log("Bank Data:", data);
    if (data && data.code === "00") {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch bank list:", error);
    return [];
  }
};