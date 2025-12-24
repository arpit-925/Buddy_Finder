import { Link } from "react-router-dom";

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {trip.image && (
        <img
          src={trip.image}
          alt={trip.destination}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {trip.destination}
        </h3>

        <p className="text-sm text-gray-500">
          {trip.startDate} – {trip.endDate} • {trip.maxPeople - trip.joinedUsers.length} spots left
        </p>

        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/trip/${trip._id}`}
            className="text-blue-600 text-sm font-medium"
          >
            View Details
          </Link>

          <span className="text-xs text-gray-400">
            Created by {trip.createdBy?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
