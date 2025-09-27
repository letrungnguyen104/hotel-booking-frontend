import { postPublic } from "@/utils/publicRequest";
import { get } from "@/utils/request"

export const getUserById = async (userId) => {
  const response = await get(`users/get-user/${userId}`);
  return response.result;
}

export const register = async (userData) => {
  const response = await postPublic(`users/register`, userData);
  return response;
}