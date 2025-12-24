import api from "./api";

/* =========================
   Trip APIs
========================= */

// ✅ FETCH ALL TRIPS
export const fetchAllTrips = async () => {
  const res = await api.get("/trips");
  return res.data.trips || res.data;
};

// ❌ REMOVE unless backend route exists
// export const fetchMyTrips = async () => {
//   const res = await api.get("/trips/my-trips");
//   return res.data;
// };

// ✅ CREATE TRIP
export const createTripApi = async (tripData) => {
  const res = await api.post("/trips", tripData);
  return res.data;
};

// ✅ JOIN TRIP
export const joinTripApi = async (tripId) => {
  const res = await api.post(`/trips/join/${tripId}`);
  return res.data;
};

// ✅ ACCEPT / REJECT JOIN REQUEST
export const handleJoinRequestApi = async (tripId, payload) => {
  const res = await api.put(`/trips/request/${tripId}`, payload);
  return res.data;
};

// ✅ GET TRIP BY ID
export const getTripById = async (tripId) => {
  const res = await api.get(`/trips/${tripId}`);
  return res.data;
};
