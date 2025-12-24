import { useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTrips } from "../context/TripContext";
import Loader from "../components/common/Loader";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { trips, loading, fetchAllTrips } = useTrips();

  const userId = user?._id?.toString();

  useEffect(() => {
    if (!trips.length) {
      fetchAllTrips();
    }
  }, [trips.length, fetchAllTrips]);

  if (loading) return <Loader fullScreen />;

  const createdTrips = useMemo(
    () =>
      trips.filter(
        (trip) => trip.createdBy?._id?.toString() === userId
      ),
    [trips, userId]
  );

  const joinedTrips = useMemo(
    () =>
      trips.filter(
        (trip) =>
          trip.joinedUsers?.some(
            (u) =>
              u?.toString?.() === userId ||
              u?._id?.toString() === userId
          ) &&
          trip.createdBy?._id?.toString() !== userId
      ),
    [trips, userId]
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
          <img
            src={user?.avatar || "https://i.pravatar.cc/150"}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>

            <p className="mt-3 text-sm text-gray-600 max-w-md">
              {user?.bio ||
                "🌍 Travel enthusiast looking for amazing experiences and like-minded buddies."}
            </p>

            <Link
              to="/edit-profile"
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Trips Created" value={createdTrips.length} />
          <StatCard label="Trips Joined" value={joinedTrips.length} />
          <StatCard label="Total Trips" value={createdTrips.length + joinedTrips.length} />
        </div>

        {/* CREATED */}
        <Section title="Trips You Created">
          {createdTrips.length === 0 ? (
            <Empty text="You haven’t created any trips yet." />
          ) : (
            <TripGrid trips={createdTrips} isCreator />
          )}
        </Section>

        {/* JOINED */}
        <Section title="Trips You Joined">
          {joinedTrips.length === 0 ? (
            <Empty text="You haven’t joined any trips yet." />
          ) : (
            <TripGrid trips={joinedTrips} />
          )}
        </Section>

      </div>
    </div>
  );
};

/* COMPONENTS (unchanged) */
const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-4 text-center">
    <h3 className="text-2xl font-bold">{value}</h3>
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Empty = ({ text }) => (
  <p className="text-gray-500 text-sm">{text}</p>
);

const TripGrid = ({ trips, isCreator }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {trips.map((trip) => {
      const isClosed =
        trip.status === "CLOSED" ||
        trip.joinedUsers.length >= trip.maxPeople;

      return (
        <div key={trip._id} className="border rounded-xl p-4 flex gap-4">
          <img
            src={trip.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"}
            alt={trip.destination}
            className="w-24 h-20 rounded-lg object-cover"
          />

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">{trip.destination}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isClosed ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                {isClosed ? "CLOSED" : "OPEN"}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              {new Date(trip.startDate).toLocaleDateString()} →{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>

            {!isCreator && (
              <p className="text-xs text-gray-400">
                Host: {trip.createdBy?.name}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <Link to={`/trip/${trip._id}`} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">
                View
              </Link>

              {isCreator && (
                <Link to={`/edit-trip/${trip._id}`} className="text-xs bg-yellow-500 text-white px-3 py-1 rounded">
                  Edit
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default Profile;
