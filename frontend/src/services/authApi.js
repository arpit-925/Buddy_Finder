import api from "./api";

/* =========================
   Auth APIs
========================= */

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
export const resendVerificationEmail = async (email) => {
  const res = await api.post("/auth/resend-verification", { email });
  return res.data;
};
