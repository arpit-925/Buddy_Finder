import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { uploadImage } from "../utils/uploadImage";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateUser } = useContext(AuthContext); // ✅ FIX
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [travelType, setTravelType] = useState("");
  const [budget, setBudget] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  /* ================= SYNC FROM CONTEXT ================= */
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setTravelType(user.preferences?.travelType || "");
      setBudget(user.preferences?.budget || "");
      setPreview(user.avatar || "https://i.pravatar.cc/150");
    }
  }, [user]);

  /* ================= IMAGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be under 2MB");
    }

    setImage(file);
    setPreview(URL.createObjectURL(file)); // UI preview only
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let avatarUrl = user.avatar;

      // Upload ONLY if new image selected
      if (image) {
        avatarUrl = await uploadImage(image);
      }

      const res = await api.put("/users/profile", {
        name,
        bio,
        avatar: avatarUrl,
        preferences: {
          travelType,
          budget: Number(budget),
        },
      });

      // ✅ SINGLE SOURCE OF TRUTH
      updateUser(res.data.user);

      toast.success("Profile updated successfully ✅");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Profile 👤
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border mb-3"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full"
            placeholder="Your name"
            required
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input w-full h-24"
            placeholder="Tell something about yourself..."
          />

          <select
            value={travelType}
            onChange={(e) => setTravelType(e.target.value)}
            className="input w-full"
          >
            <option value="">Preferred Travel Type</option>
            <option value="mountain">Mountain</option>
            <option value="beach">Beach</option>
            <option value="city">City</option>
            <option value="adventure">Adventure</option>
          </select>

          <input
            type="number"
            placeholder="Preferred Budget (₹)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="input w-full"
          />

          <button
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-full disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
