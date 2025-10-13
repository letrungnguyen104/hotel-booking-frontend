import { postPublic } from "@/utils/publicRequest";
import { get, put, putFormData } from "@/utils/request"

export const getUserById = async (userId) => {
  const response = await get(`users/get-user/${userId}`);
  return response.result;
}

export const register = async (userData) => {
  const response = await postPublic(`users/register`, userData);
  return response;
}

export const preRegister = async (userData) => {
  const response = await postPublic(`users/pre-register`, userData);
  return response;
};

export const verifyRegister = async (data) => {
  const response = await postPublic(`users/verify-register`, data);
  return response;
};

export const updateUserProfile = async (formData) => {
  const res = await putFormData('users/my-profile', formData);
  return res.result;
};

export const changeMyPassword = async (data) => {
  const response = await put('users/my-profile/change-password', data);
  return response;
};