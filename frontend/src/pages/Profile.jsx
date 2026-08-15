import { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiCompass, FiEdit3, FiMapPin } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { useTrips } from "../context/TripContext";
import TripCard from "../components/trips/TripCard";

export default function Profile() {
  const { user } = useContext(AuthContext); 
  const { trips, loading, fetchAllTrips } = useTrips(); 
  const userId = user?._id?.toString();
  
  useEffect(() => { 
    if (!trips.length) fetchAllTrips(); 
  }, [trips.length, fetchAllTrips]);
  
  const created = useMemo(() => trips.filter((trip) => trip.createdBy?._id?.toString() === userId), [trips, userId]);
  const joined = useMemo(() => trips.filter((trip) => trip.createdBy?._id?.toString() !== userId && trip.joinedUsers?.some((member) => member?._id?.toString() === userId || member?.toString?.() === userId)), [trips, userId]);
  
  return <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
    <div className="mx-auto max-w-6xl">
      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="h-28 bg-ocean-gradient sm:h-36" />
        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-3xl font-bold text-primary shadow-sm">
                {user?.avatar ? (
                  <img src={user.avatar} alt={`${user.name}'s profile`} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.[0]
                )}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-ink">{user?.name}</h1>
                <p className="mt-1 text-sm text-muted">{user?.email}</p>
              </div>
            </div>
            <Link to="/edit-profile" className="btn">
              <FiEdit3 />Edit profile
            </Link>
          </div>
        </div>
      </section>
      
      {/* Bio and Preferences */}
      <p className="mt-6 max-w-2xl text-slate-600">
        {user?.bio || "Add a short bio to help compatible travel companions get to know you."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Tag label="Preferred budget" value={user?.preferences?.budget ? `₹${Number(user.preferences.budget).toLocaleString()}` : "Not set"} />
        <Tag label="Travel type" value={user?.preferences?.travelType || "Not set"} />
        <Tag label="Season" value={user?.preferences?.season || "Not set"} />
      </div>
      
      {/* Trips Section */}
      <section className="mt-10">
        {/* Trips you created */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-teal">YOUR ADVENTURES</p>
            <h2 className="mt-1 text-2xl font-bold text-ink">Trips you created</h2>
          </div>
          <span className="text-sm text-muted">{created.length} total</span>
        </div>
        {loading ? <Skeletons /> : created.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {created.map((trip) => <TripCard key={trip._id} trip={trip} />)}
          </div>
        ) : (
          <Empty 
            title="You haven’t created a trip yet." 
            text="Share an idea and find people who want to go too..." 
            to="/create-trip" 
            action="Create a trip" 
          />
        )}
        
        {/* Trips you've joined */}
        {joined.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between mt-8">
              <div>
                <p className="text-sm font-semibold text-teal">TRIPS YOU'VE JOINED</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Trips you've joined</h2>
              </div>
              <span className="text-sm text-muted">{joined.length} total</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {joined.map((trip) => <TripCard key={trip._id} trip={trip} />)}
            </div>
          </>
        )}
      </section>
    </div>
  </main>;
}

function Tag({ label, value }) { 
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-2">
      <span className="block text-xs font-medium text-muted">{label}</span>
      <span className="block text-sm font-semibold capitalize text-ink">{value}</span>
    </div>
  ); 
}

function Empty({ title, text, action, to }) { 
  return (
    <div className="card p-8 text-center">
      <FiCompass className="mx-auto text-3xl text-primary" />
      <h3 className="mt-3 font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{text}</p>
      <Link to={to} className="btn mt-5">{action}</Link>
    </div>
  ); 
}

function Skeletons() { 
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1,2,3].map((item) => (
        <div key={item} className="card h-72 animate-pulse bg-slate-100" />
      ))}
    </div>
  ); 
}