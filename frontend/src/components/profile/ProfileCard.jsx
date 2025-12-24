import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProfileCard = () => {
  const { user } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    preferences: user?.preferences || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // 🔗 API call will go here later
    console.log("Updated Profile:", formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
      <div className="flex flex-col items-center">
        <img
          src={user?.profilePic || "https://via.placeholder.com/120"}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover mb-4"
        />

        {!isEditing ? (
          <>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="mt-2 text-sm text-gray-600">
              📍 {user?.location || "Location not set"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              🎯 {user?.preferences || "No preferences"}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              className="input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <input
              className="input mt-2"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
            />
            <input
              className="input mt-2"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              placeholder="Travel Preferences"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
