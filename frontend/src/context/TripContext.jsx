import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchAllTrips,
  createTripApi,
  getTripById,
} from "../services/tripApi";
import api from "../services/api";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH ALL TRIPS
  ========================= */
 const fetchAllTripsHandler = async () => {
  try {
    setLoading(true);
    const data = await fetchAllTrips();

    // ✅ normalize response
    const tripsArray = Array.isArray(data) ? data : data.trips;
    setTrips(tripsArray || []);
  } catch (error) {
    console.error("Failed to fetch trips:", error);
  } finally {
    setLoading(false);
  }
};


  /* =========================
     CREATE TRIP
  ========================= */
  const createTrip = async (tripData) => {
    try {
      setLoading(true);
      const newTrip = await createTripApi(tripData);

      // 🔁 Instant UI update
      setTrips((prev) => [newTrip, ...prev]);

      return newTrip;
    } catch (error) {
      console.error("Failed to create trip:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE TRIP (EDIT)
  ========================= */
  const updateTrip = async (tripId, updatedData) => {
    try {
      setLoading(true);
      const res = await api.put(`/trips/${tripId}`, updatedData);
      const updatedTrip = res.data;

      setTrips((prev) =>
        prev.map((trip) =>
          trip._id === tripId ? updatedTrip : trip
        )
      );

      return updatedTrip;
    } catch (error) {
      console.error("Failed to update trip:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE TRIP
  ========================= */
  const deleteTrip = async (tripId) => {
    try {
      setLoading(true);
      await api.delete(`/trips/${tripId}`);

      setTrips((prev) =>
        prev.filter((trip) => trip._id !== tripId)
      );
    } catch (error) {
      console.error("Failed to delete trip:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     AUTO LOAD TRIPS ON APP START
  ========================= */
  useEffect(() => {
    fetchAllTripsHandler();
  }, []);

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        fetchAllTrips: fetchAllTripsHandler,
        createTrip,
        updateTrip,
        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);
