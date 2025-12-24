import api from "../../services/api";
import toast from "react-hot-toast";

const JoinRequests = ({ trip, refreshTrip }) => {
  const handleAction = async (userId, action) => {
    try {
      await api.put(`/trips/request/${trip._id}`, {
        userId,
        action,
      });

      toast.success(`Request ${action}ed`);
      refreshTrip(); // re-fetch trip data
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (trip.joinRequests.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No pending requests
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {trip.joinRequests.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAction(user._id, "accept")}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Accept
            </button>

            <button
              onClick={() => handleAction(user._id, "reject")}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequests;
