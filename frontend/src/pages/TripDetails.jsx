import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import JoinRequests from "../components/trips/JoinRequests";
import MapBoxView from "../components/maps/MapBoxView";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH TRIP ================= */
  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
    } catch {
      toast.error("Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  /* ================= JOIN ================= */
  const handleJoinTrip = async () => {
    try {
      setJoining(true);
      await api.post(`/trips/join/${trip._id}`);
      toast.success("Join request sent");
      fetchTrip();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteTrip = async () => {
    if (trip.joinedUsers.length > 1) {
      toast.error("Cannot delete a trip with joined users");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/trips/${trip._id}`);
      toast.success("Trip deleted successfully");
      navigate("/explore");
    } catch {
      toast.error("Failed to delete trip");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= STATES ================= */
  if (loading) return <Loader fullScreen />;

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Trip not found</p>
      </div>
    );
  }

  const userId = user?._id?.toString();
  const isCreator = trip.createdBy?._id?.toString() === userId;

  const isJoined = trip.joinedUsers?.some(
    (u) => u === userId || u?._id === userId
  );

  const isRequested = trip.joinRequests?.some(
    (u) => u === userId || u?._id === userId
  );

  const spotsLeft = trip.maxPeople - trip.joinedUsers.length;
  const isClosed = trip.status === "CLOSED";

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src={trip.image || "https://source.unsplash.com/1200x600/?travel"}
              alt={trip.destination}
              className="w-full h-72 object-cover"
            />

            <div className="p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{trip.destination}</h1>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isClosed
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {isClosed ? "Closed" : "Open"}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(trip.startDate).toLocaleDateString()} →{" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </p>

              <p className="mt-4 text-gray-700">{trip.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <p><strong>Budget:</strong> ₹{trip.budget}</p>
                <p><strong>Spots Left:</strong> {spotsLeft}</p>
              </div>
            </div>
          </div>

          {/* MAP */}
         
{trip.location &&
 trip.location.lat != null &&
 trip.location.lng != null && (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="font-semibold mb-2">Trip Location</h3>

    <MapBoxView
      lat={Number(trip.location.lat)}
      lng={Number(trip.location.lng)}
    />

    {trip.location.address && (
      <p className="text-sm text-gray-500 mt-2">
        📍 {trip.location.address}
      </p>
    )}
  </div>
)}


        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-4">

          {/* HOST */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Trip Host</h3>
            <p className="font-medium">{trip.createdBy?.name}</p>
            <p className="text-sm text-gray-500">{trip.createdBy?.email}</p>
          </div>

          {/* ACTIONS */}
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            {isCreator ? (
              <>
                <button
                  onClick={() => navigate(`/edit-trip/${trip._id}`)}
                  className="w-full bg-yellow-500 text-white py-2 rounded"
                >
                  ✏️ Edit Trip
                </button>

                <button
                  onClick={handleDeleteTrip}
                  disabled={deleting}
                  className="w-full bg-red-600 text-white py-2 rounded disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "🗑️ Delete Trip"}
                </button>
              </>
            ) : isJoined ? (
              <button
                onClick={() => navigate(`/chat/${trip._id}`)}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Open Chat 💬
              </button>
            ) : isRequested ? (
              <button disabled className="w-full bg-gray-300 py-2 rounded">
                Request Sent
              </button>
            ) : (
              <button
                onClick={handleJoinTrip}
                disabled={joining || spotsLeft === 0 || isClosed}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
              >
                {joining ? "Sending..." : "Join Trip"}
              </button>
            )}
          </div>

          {/* JOIN REQUESTS */}
          {isCreator && (
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-3">Join Requests</h3>
              <JoinRequests trip={trip} refreshTrip={fetchTrip} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
