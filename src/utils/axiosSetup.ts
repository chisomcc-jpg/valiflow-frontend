// src/utils/axiosSetup.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

/**
 * 🧠 setupAxios()
 * Initierar globala interceptors för Valiflow frontend.
 * Hanterar:
 *  - Token injection
 *  - Automatisk session-expiration redirect
 *  - Säker hantering av 401 / jwt-fel
 */
export function setupAxios() {
  /* 🔹 Request interceptor */
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  /* 🔹 Response interceptor */
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const url = error.config?.url || "unknown";

      // 🧩 Ignorera auth-race efter login/register
      if (
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/register")
      ) {
        return Promise.reject(error);
      }

      if (status === 401) {
        console.warn("🔒 Unauthorized or expired token", {
          url,
          message: error.response?.data,
        });

        // 🧹 Rensa session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("companyId");

        // 🚫 Förhindra dubbel logout
        if (!window.__valiflow_logout_triggered) {
          window.__valiflow_logout_triggered = true;

          toast.error(
            "Sessionen har gått ut. Logga in igen för att fortsätta.",
            { duration: 4000 }
          );

          setTimeout(() => {
            window.__valiflow_logout_triggered = false;
            window.location.href = "/login";
          }, 1800);
        }
      }

      return Promise.reject(error);
    }
  );

  if (import.meta.env.DEV) {
    console.log("🧩 Axios interceptors initialized (Valiflow)");
  }
}
