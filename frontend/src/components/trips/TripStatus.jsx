import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const TripStatus = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
      <h3 className="font-semibold">My Status</h3>

      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="text-sm">
        <p>Trips Joined: 5</p>
        <p className="text-red-500">2 New Requests</p>
      </div>
    </div>
  );
};

export default TripStatus;
