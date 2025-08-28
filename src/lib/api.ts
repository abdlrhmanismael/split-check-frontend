import axios from "axios";
import type {
  SessionSummaryResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  UpdatePaymentRequest,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://split-check-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Sessions
export const createSession = async (
  data: CreateSessionRequest
): Promise<CreateSessionResponse> => {
  const formData = new FormData();

  // Add text fields
  formData.append("totalOrderAmount", data.totalAmount.toString());
  if (data.taxPercentage)
    formData.append("taxPercentage", data.taxPercentage.toString());
  if (data.servicePercentage)
    formData.append("servicePercentage", data.servicePercentage.toString());
  if (data.deliveryFee)
    formData.append("deliveryFee", data.deliveryFee.toString());
  if (data.numberOfFriends)
    formData.append("numberOfFriends", data.numberOfFriends.toString());
  if (data.instaPayUrl) formData.append("instaPayURL", data.instaPayUrl);
  if (data.billImage) formData.append("billImage", data.billImage);

  const response = await api.post("/sessions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getSessionSummary = async (
  sessionId: string
): Promise<SessionSummaryResponse> => {
  const response = await api.get(`/sessions/${sessionId}/summary`);
  return response.data;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await api.delete(`/sessions/${sessionId}`);
};

// Friends
export const joinSession = async (
  sessionId: string,
  data: JoinSessionRequest
): Promise<JoinSessionResponse> => {
  const response = await api.post(`/sessions/${sessionId}/friends`, data);
  return response.data;
};

export const updateFriendPayment = async (
  sessionId: string,
  friendId: string,
  data: UpdatePaymentRequest
): Promise<void> => {
  await api.patch(`/sessions/${sessionId}/friends/${friendId}/payment`, data);
};

export default api;
