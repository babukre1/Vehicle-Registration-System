import axios, { type AxiosInstance } from "axios";
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  CreateRegistrationRequest,
  UpdateStatusRequest,
  VehicleRegistration,
  User,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as { message?: string | string[]; details?: string[] } | undefined;
  if (data?.details?.length) return `${data.message ?? fallback} ${data.details.join(" ")}`;
  if (Array.isArray(data?.message)) return data.message.join(" ");
  if (typeof data?.message === "string") return data.message;
  if (!error.response) return "The service could not be reached. Check your connection and try again.";
  return fallback;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vr_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
};

// Registrations API
export const registrationsApi = {
  create: async (
    data: CreateRegistrationRequest,
  ): Promise<VehicleRegistration> => {
    const response = await apiClient.post("/registrations", data);
    return response.data;
  },

  uploadAttachment: async (registrationId: string, file: File) => {
    const body = new FormData();
    body.append("file", file);
    const response = await apiClient.post(`/registrations/${registrationId}/attachments`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAttachmentUrl: async (attachmentId: string): Promise<{ url: string; fileName: string }> => {
    const response = await apiClient.get(`/registrations/attachments/${attachmentId}/download`);
    return response.data;
  },

  list: async (params?: {
    userId?: string;
  }): Promise<VehicleRegistration[]> => {
    const response = await apiClient.get("/registrations", { params });
    return response.data;
  },

  getById: async (id: string): Promise<VehicleRegistration> => {
    const response = await apiClient.get(`/registrations/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: string,
    data: UpdateStatusRequest,
  ): Promise<VehicleRegistration> => {
    const response = await apiClient.patch(
      `/registrations/${id}/status`,
      data,
    );
    return response.data;
  },
};

export default apiClient;
