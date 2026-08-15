import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// ✅ Attach token automatically
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { token } = JSON.parse(auth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Recover from stale/expired/invalid tokens
// A 401 on any protected endpoint means the stored token can no longer
// authenticate. Clear it once and send the user back to login instead of
// retrying the same expired token forever.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Don't hijack the login/register endpoints — those surfaces handle
    // their own errors (e.g. "Invalid credentials").
    const isAuthEndpoint = /\/auth\/(login|register|resend-verification)\/?/.test(url);

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("auth");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
