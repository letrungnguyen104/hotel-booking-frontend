// src/service/tokenService.js
// Lưu token với thời gian hết hạn (ms)
import { jwtDecode } from "jwt-decode";

export const setToken = (token, expiryInMinutes = 60) => {
  const expiryTime = new Date().getTime() + expiryInMinutes * 60 * 1000;
  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", expiryTime);
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  const expiryTime = localStorage.getItem("token_expiry");

  if (!token || !expiryTime) return null;

  if (new Date().getTime() > Number(expiryTime)) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    return null;
  }
  return token;
};

// Xoá token
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};