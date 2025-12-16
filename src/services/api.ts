// src/services/api.ts
// ------------------------------------------------------------------
// 🌍 Valiflow API-klient (Vite + Axios)
// - Bas-URL via VITE_API_URL (ex: http://localhost:4000)
// - Alla requests går mot `${API_URL}/api/...`
// - JWT i Authorization-header
// - Silent token refresh med queue
// ------------------------------------------------------------------

import axios, { AxiosInstance } from "axios";

// ------------------------------------------------------------------
// 🌍 Base URL (fixar både localhost & https-prod)
// ------------------------------------------------------------------

const RAW = import.meta.env.VITE_API_URL || "http://localhost:4000";
// Ta bort trailing slash
const API_URL = RAW.replace(/\/+$/, "");

if (!/^https?:\/\//i.test(API_URL)) {
  console.warn(
    "⚠️ VITE_API_URL saknar http/https – se till att den är t.ex. http://localhost:4000"
  );
}

// ------------------------------------------------------------------
// 🔗 Axios-instans
//   OBS: baseURL pekar på /api, så alla services använder bara "/invoices", "/company", etc.
// ------------------------------------------------------------------

export const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ------------------------------------------------------------------
// 🔐 Token -> Authorization header
// ------------------------------------------------------------------

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------------------------------------
// ♻️ Token Refresh System — robust enterprise version
// ------------------------------------------------------------------

let isRefreshing = false;
let queue: Array<(t: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const expired = error?.response?.data?.token_expired === true;

    // Endast vid 401 + token_expired försöker vi refresh
    if (status === 401 && expired) {
      const oldToken = localStorage.getItem("token");

      // Starta refresh om ingen annan redan gör det
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${API_URL}/api/auth/refresh`,
            null,
            {
              headers: { Authorization: `Bearer ${oldToken}` },
              withCredentials: true,
            }
          );

          const newToken = res?.data?.token;
          if (!newToken) throw new Error("No token returned");

          // Spara ny token
          localStorage.setItem("token", newToken);

          // Låt alla köade requests gå igenom med nya token
          queue.forEach((cb) => cb(newToken));
          queue = [];

          // Re-run original request
          const cfg = error.config;
          cfg.headers = cfg.headers ?? {};
          cfg.headers.Authorization = `Bearer ${newToken}`;
          return api(cfg);
        } catch (e) {
          console.error("❌ Refresh token failed:", e);
          localStorage.removeItem("valiflow_token");
        } finally {
          isRefreshing = false;
        }
      }

      // Om refresh redan pågår → köa denna request
      return new Promise((resolve) => {
        queue.push((t: string) => {
          const cfg = error.config;
          cfg.headers = cfg.headers ?? {};
          cfg.headers.Authorization = `Bearer ${t}`;
          resolve(api(cfg));
        });
      });
    }

    // Allt annat: bubbla upp felet
    return Promise.reject(error);
  }
);

// ------------------------------------------------------------------
// 🔁 Export default för bakåtkompatibilitet
//   - Så både `import { api }` och `import api` funkar
// ------------------------------------------------------------------

export default api;
