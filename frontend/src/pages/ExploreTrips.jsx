import { useEffect, useMemo, useState, useContext } from "react";
import { useTrips } from "../context/TripContext";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import { Link, useNavigate } from "react-router-dom";
import { suggestedPlaces } from "../data/suggestedPlaces";

/* =========================
   SEASON HELPER
========================= */
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 11 || month <= 2) return "winter";
  if (month >= 3 && month <= 6) return "summer";
  return "monsoon";
};

const ExploreTrips = () => {
  const { trips, fetchAllTrips, loading } = useTrips();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ================= USER PREFS ================= */
  const userPrefs = user?.preferences || {};
  const preferredSeason = userPrefs.season || getCurrentSeason();
  const preferredTravelType = userPrefs.travelType || "";
  const preferredBudget = userPrefs.budget || 50000;

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [budgetRange, setBudgetRange] = useState(preferredBudget);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [status, setStatus] = useState("ALL");

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!trips.length) fetchAllTrips();
  }, [fetchAllTrips, trips.length]);

  /* ================= FILTER + RANK ================= */
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        const joinedCount = trip.joinedUsers?.length || 0;
        const isFull = joinedCount >= trip.maxPeople;

        if (
          search &&
          !trip.destination?.toLowerCase().includes(search.toLowerCase())
        )
          return false;

        if (trip.budget > budgetRange) return false;
        if (onlyAvailable && isFull) return false;
        if (status === "OPEN" && isFull) return false;
        if (status === "FULL" && !isFull) return false;

        return true;
      })
      .sort((a, b) => {
        const aScore =
          preferredTravelType &&
          a.destination?.toLowerCase().includes(preferredTravelType)
            ? 1
            : 0;
        const bScore =
          preferredTravelType &&
          b.destination?.toLowerCase().includes(preferredTravelType)
            ? 1
            : 0;
        return bScore - aScore;
      });
  }, [
    trips,
    search,
    budgetRange,
    onlyAvailable,
    status,
    preferredTravelType,
  ]);

  /* ================= SUGGESTED ================= */
  const suggested = suggestedPlaces.filter((p) => {
    if (preferredSeason && !p.season.includes(preferredSeason)) return false;
    if (preferredTravelType && p.type !== preferredTravelType) return false;
    return true;
  });

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-slate-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
        Explore Trips 🌍
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ================= FILTER SIDEBAR ================= */}
        <div className="bg-white rounded-xl shadow p-4 space-y-5 h-fit sticky top-24">
          <h3 className="font-semibold text-lg text-slate-800">
            Filters
          </h3>

          <input
            type="text"
            placeholder="Search destination..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* BUDGET */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Max Budget: ₹{budgetRange.toLocaleString()}
            </label>

            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={budgetRange}
              onChange={(e) => setBudgetRange(Number(e.target.value))}
              className="w-full accent-blue-600 mt-2"
            />

            <div className="flex justify-between text-xs text-slate-400">
              <span>₹1k</span>
              <span>₹2L</span>
            </div>
          </div>

          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ALL">All Trips</option>
            <option value="OPEN">Open</option>
            <option value="FULL">Full</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Only available
          </label>

          {(preferredTravelType || userPrefs.budget) && (
            <p className="text-xs text-blue-600">
              🎯 Personalized for you
            </p>
          )}
        </div>

        {/* ================= MAIN ================= */}
        <div className="lg:col-span-3 space-y-12">

          {/* TRIPS */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Recommended Trips
            </h2>

            {filteredTrips.length === 0 ? (
              <p className="text-slate-500">
                No trips found 😕 Try adjusting filters.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => {
                  const joinedCount = trip.joinedUsers?.length || 0;
                  const isFull = joinedCount >= trip.maxPeople;

                  return (
                    <div
                      key={trip._id}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                      <img
                        src={
                          trip.image ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop"
                        }
                        alt={trip.destination}
                        className="h-48 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="font-semibold text-slate-800">
                          {trip.destination}
                        </h3>

                        <p className="text-sm text-slate-500">
                          ₹{trip.budget} • {joinedCount}/{trip.maxPeople}
                        </p>

                        <Link
                          to={`/trip/${trip._id}`}
                          className="block mt-3 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                        >
                          View Trip
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* SUGGESTED */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Suggested Places ({preferredSeason})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {suggested.map((place) => (
                <div
                  key={place.name}
                  className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition"
                  onClick={() =>
                    user
                      ? navigate("/create-trip", {
                          state: {
                            destination: place.name,
                            image: place.image,
                            location: {
                              lat: place.lat,
                              lng: place.lng,
                              address: place.name,
                            },
                          },
                        })
                      : navigate("/login")
                  }
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-3 text-center font-medium text-slate-800">
                    {place.name}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ExploreTrips;
