import Trip from "../models/Trip.js";
import Notification from "../models/Notification.js";

/* =========================
   CREATE TRIP
========================= */
export const createTrip = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      maxPeople,
      preferences,
      description,
      image,
      location,
    } = req.body;

    if (
      !destination ||
      !startDate ||
      !endDate ||
      !maxPeople ||
      !description ||
      !location?.lat ||
      !location?.lng
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const trip = await Trip.create({
      destination: destination.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: budget || 0,
      maxPeople,
      preferences: preferences || "",
      description,
      image,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat],
        address: location.address || "",
      },
      createdBy: req.user._id,
      joinedUsers: [req.user._id],
      status: "OPEN",
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate("createdBy", "name email avatar")
      .populate("joinedUsers", "name email avatar");

    const responseTrip = populatedTrip.toObject();
    responseTrip.location = {
      lng: responseTrip.location.coordinates[0],
      lat: responseTrip.location.coordinates[1],
      address: responseTrip.location.address,
    };

    res.status(201).json(responseTrip);
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};

/* =========================
   GET ALL TRIPS
========================= */
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("createdBy", "name email avatar")
      .populate("joinedUsers", "name email avatar")
      .sort({ createdAt: -1 });

    const formatted = trips.map((trip) => {
      const t = trip.toObject();
      if (t.location?.coordinates) {
        t.location = {
          lng: t.location.coordinates[0],
          lat: t.location.coordinates[1],
          address: t.location.address,
        };
      }
      return t;
    });

    res.json(formatted);
  } catch {
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

/* =========================
   GET TRIP BY ID  ✅ FIX
========================= */
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("createdBy", "name email avatar")
      .populate("joinedUsers", "name email avatar")
      .populate("joinRequests", "name email avatar");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const t = trip.toObject();
    if (t.location?.coordinates) {
      t.location = {
        lng: t.location.coordinates[0],
        lat: t.location.coordinates[1],
        address: t.location.address,
      };
    }

    res.json(t);
  } catch {
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

/* =========================
   UPDATE TRIP (HOST ONLY)
========================= */
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(trip, {
      destination: req.body.destination?.trim() || trip.destination,
      startDate: req.body.startDate || trip.startDate,
      endDate: req.body.endDate || trip.endDate,
      budget: req.body.budget ?? trip.budget,
      maxPeople: req.body.maxPeople || trip.maxPeople,
      description: req.body.description || trip.description,
      image: req.body.image ?? trip.image,
    });

    if (req.body.location?.lat && req.body.location?.lng) {
      trip.location = {
        type: "Point",
        coordinates: [req.body.location.lng, req.body.location.lat],
        address: req.body.location.address || "",
      };
    }

    // await trip.save();
    // res.json({ message: "Trip updated successfully" });

    await trip.save();

    // 🔁 Return UPDATED trip (IMPORTANT PART)
    const updatedTrip = await Trip.findById(trip._id)
      .populate("createdBy", "name email avatar")
      .populate("joinedUsers", "name email avatar");

    const t = updatedTrip.toObject();
    if (t.location?.coordinates) {
      t.location = {
        lng: t.location.coordinates[0],
        lat: t.location.coordinates[1],
        address: t.location.address,
      };
    }

    res.json(t);
 } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({ message: "Failed to update trip" });
  }
};

/* =========================
   DELETE TRIP (HOST ONLY)
========================= */
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete trip" });
  }
};

/* =========================
   JOIN TRIP (REQUEST)
========================= */
export const joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.status === "CLOSED") {
      return res.status(400).json({ message: "Trip is already full" });
    }

    if (trip.joinedUsers.includes(req.user._id)) {
      return res.status(400).json({ message: "Already joined" });
    }

    if (trip.joinRequests.includes(req.user._id)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    trip.joinRequests.push(req.user._id);
    await trip.save();

    res.json({ message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ACCEPT / REJECT REQUEST
========================= */
export const handleJoinRequest = async (req, res) => {
  try {
    const { userId, action } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    trip.joinRequests = trip.joinRequests.filter(
      (id) => id.toString() !== userId
    );

    if (action === "accept") {
      if (trip.joinedUsers.length >= trip.maxPeople) {
        return res.status(400).json({ message: "Trip is full" });
      }

      trip.joinedUsers.push(userId);
      if (trip.joinedUsers.length === trip.maxPeople) {
        trip.status = "CLOSED";
      }

      await Notification.create({
        userId,
        message: "Your join request was accepted 🎉",
        type: "JOIN_ACCEPTED",
      });
    }

    await trip.save();
    res.json({ message: "Request processed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
