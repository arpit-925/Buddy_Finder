import MapBoxView from "./MapBoxView";
import { Link } from "react-router-dom";

const ExploreTripsMap = ({ trips }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 h-[500px]">
      <MapBoxView
        multipleMarkers
        markers={trips
          .filter((t) => t.location?.lat && t.location?.lng)
          .map((trip) => ({
            lat: trip.location.lat,
            lng: trip.location.lng,
            popup: (
              <div className="text-sm">
                <p className="font-semibold">{trip.destination}</p>
                <p className="text-xs text-gray-500">
                  👥 {trip.joinedUsers.length}/{trip.maxPeople}
                </p>
                <Link
                  to={`/trip/${trip._id}`}
                  className="text-blue-600 underline text-xs"
                >
                  View Trip
                </Link>
              </div>
            ),
          }))}
      />
    </div>
  );
};

export default ExploreTripsMap;
