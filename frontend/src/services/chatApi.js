import api from "./api";

/* =========================
   Chat APIs
========================= */

export const fetchMessages = async (tripId) => {
  const res = await api.get(`/messages/${tripId}`);
  return res.data;
};

export const sendMessageApi = async (messageData) => {
  const res = await api.post("/messages/send", messageData);
  return res.data;
};
