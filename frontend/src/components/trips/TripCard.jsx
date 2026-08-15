import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { resolveDestinationImage } from "../../utils/destinationImage";

export default function TripCard({ trip }) {
  const joined = trip.joinedUsers?.length || 0;
  const full = trip.status === "CLOSED" || joined >= trip.maxPeople;
  const coverImage = trip.image || resolveDestinationImage(trip.destination);

  return (
    <article className="card group overflow-hidden">
      <div className="relative h-48 bg-slate-100">
        {coverImage ? (
          <img src={coverImage} alt={trip.destination} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="h-full bg-ocean-gradient" />
        )}
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${full ? "bg-slate-800 text-white" : "bg-white text-success"}`}>
          {full ? "CLOSED" : "OPEN"}
        </span>
      </div>
      <div className="p-5">
        <h3 className="truncate text-lg font-bold text-ink">{trip.destination}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <FiCalendar />
          {trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "Dates to be confirmed"}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-bold text-ink">₹{Number(trip.budget || 0).toLocaleString()}</span>
          <span className="flex items-center gap-1 text-muted">
            <FiUsers />
            {joined}/{trip.maxPeople}
          </span>
        </div>
        <p className="mt-3 truncate text-xs text-muted">Hosted by {trip.createdBy?.name || "Buddy Finder traveler"}</p>
        <Link to={`/trip/${trip._id}`} className="btn mt-5 w-full">
          View details
        </Link>
      </div>
    </article>
  );
}