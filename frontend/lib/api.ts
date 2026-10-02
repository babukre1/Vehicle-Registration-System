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
    const response = await apiClient.post("/api/registrations", data);
    console.log(response);

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
    const response = await apiClient.get("/api/registrations", { params });
    return response.data;
  },

  getById: async (id: string): Promise<VehicleRegistration> => {
    const response = await apiClient.get(`/api/registrations/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: string,
    data: UpdateStatusRequest,
  ): Promise<VehicleRegistration> => {
    const response = await apiClient.patch(
      `/api/registrations/${id}/status`,
      data,
    );
    return response.data;
  },
};

export default apiClient;
