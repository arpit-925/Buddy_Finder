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
  const [season, setSeason] = useState("");
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
      setSeason(user.preferences?.season || "");
      setBudget(user.preferences?.budget?.toString() || "");
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

    // Basic validation
    if (!name.trim()) {
      return toast.error("Please enter your name");
    }

    if (name.trim().length < 2) {
      return toast.error("Name must be at least 2 characters long");
    }

    if (bio && bio.length > 500) {
      return toast.error("Bio must be less than 500 characters");
    }

    if (budget !== "" && isNaN(Number(budget))) {
      return toast.error("Please enter a valid budget number");
    }

    if (budget !== "" && Number(budget) < 0) {
      return toast.error("Budget cannot be negative");
    }

    try {
      setSaving(true);

      let avatarUrl = user.avatar;

      // Upload ONLY if new image selected
    if (image) {
      // 1. Upload to Cloudinary/S3
      const uploadedUrl = await uploadImage(image);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      } else {
        throw new Error("Image upload failed");
      }
    }

    const budgetValue = budget === "" ? user.preferences?.budget : Number(budget);

      const res = await api.put("/users/profile", {
        name,
        bio,
        avatar: avatarUrl,
        preferences: {
          travelType: travelType || user.preferences?.travelType,
          season: season || user.preferences?.season,
          budget: budgetValue,
        },
      });

      // ✅ SINGLE SOURCE OF TRUTH
      // updateUser(res.data.user);
      // 3. Update Context + LocalStorage
    // Ensure the backend structure matches (res.data.user)
    if (res.data && res.data.user) {
      updateUser(res.data.user); 
      
      // Cleanup the temporary preview URL to free memory
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      toast.success("Profile updated successfully");
      navigate("/profile");
    } else {
      throw new Error(res.data?.message || "Profile update failed");
    }
  }
    catch (error) {
      toast.error(error.response?.data?.message || error.message || "Profile update failed");
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
            <option value="spiritual">Spiritual</option>
          </select>

          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="input w-full"
          >
            <option value="">Preferred Season</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="monsoon">Monsoon</option>
            <option value="spring">Spring</option>
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
            className="w-full bg-pink-600 text-white py-2 rounded-full disabled:opacity-60"
          >
            {saving ? "Saving profile..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
