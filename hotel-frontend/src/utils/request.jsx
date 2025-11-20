import store from "@/redux/store";
import { checkLogin } from "@/action/login";
import { clearUser } from "@/action/user";
import { disconnectWebSocket } from "@/service/webSocketService";

const API_DOMAIN = `http://localhost:8081/`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    console.warn("Token expired or unauthorized. Logging out...");
    localStorage.removeItem("token");
    try {
      disconnectWebSocket();
    } catch (e) {
      console.error("Error disconnecting websocket", e);
    }
    store.dispatch(checkLogin(false));
    store.dispatch(clearUser());
    return Promise.reject("Session expired");
  }

  try {
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return Promise.reject({ ...result, status: response.status });
    }

    return result;
  } catch (error) {
    if (!response.ok) {
      return Promise.reject({ status: response.status, message: response.statusText });
    }
    return {};
  }
};

export const get = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    headers: {
      ...getAuthHeaders()
    }
  });
  return handleResponse(response);
};

export const post = async (path, data) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const del = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  });
  return handleResponse(response);
};

export const put = async (path, data) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const patch = async (path, data) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const postFormData = async (path, formData) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });
  return handleResponse(response);
};

export const patchFormData = async (path, formData) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });
  return handleResponse(response);
};

export const putFormData = async (path, formData) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  return handleResponse(response);
};