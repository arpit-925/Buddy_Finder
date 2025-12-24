import { useEffect, useState } from "react";
import axios from "axios";

const ChatSidebar = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios.get("/api/trips/my-trips").then((res) => {
      setTrips(res.data);
    });
  }, []);

  return (
    <div className="w-1/4 bg-gray-100 border-r p-4">
      <h2 className="text-xl font-bold mb-4">My Trips</h2>

      {trips.map((trip) => (
        <div
          key={trip._id}
          className="p-3 mb-2 bg-white rounded cursor-pointer hover:bg-gray-200"
        >
          {trip.destination}
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
