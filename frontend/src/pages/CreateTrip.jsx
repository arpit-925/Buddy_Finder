import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTrips } from "../context/TripContext";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { uploadImage } from "../utils/uploadImage";
import MapBoxView from "../components/maps/MapBoxView";

const CreateTrip = () => {
  const { createTrip, loading } = useTrips();
  const navigate = useNavigate();
  const locationState = useLocation().state;

  /* ================= STATE ================= */
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    locationState?.image || ""
  );

  const [location, setLocation] = useState(
    locationState?.location || {
      lat: 28.6139, // default Delhi
      lng: 77.209,
      address: "",
    }
  );

  const [formData, setFormData] = useState({
    destination: locationState?.destination || "",
    startDate: "",
    endDate: "",
    budget: "",
    maxPeople: "",
    description: "",
  });

  /* ================= AUTO-FILL FROM SUGGESTED PLACE ================= */
  useEffect(() => {
    if (locationState?.destination) {
      setFormData((prev) => ({
        ...prev,
        destination: locationState.destination,
      }));
    }

    if (locationState?.location) {
      setLocation(locationState.location);
    }

    if (locationState?.image) {
      setPreview(locationState.image);
    }
  }, [locationState]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be under 2MB");
    }

    setImage(file);
    setPreview(URL.createObjectURL(file)); // UI only
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location?.lat || !location?.lng) {
      return toast.error("Please select a trip location");
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return toast.error("End date must be after start date");
    }

    try {
      let imageUrl = "";

      // ✅ Upload only if user selected a NEW image
      if (image) {
        imageUrl = await uploadImage(image);
      } else if (preview?.startsWith("http")) {
        imageUrl = preview; // suggested place image
      }

      await createTrip({
        ...formData,
        budget: Number(formData.budget),
        maxPeople: Number(formData.maxPeople),
        image: imageUrl,
        location,
      });

      toast.success("Trip created successfully 🎉");
      navigate("/explore");
    } catch (err) {
      toast.error("Failed to create trip");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create a New Trip ✈️
        </h2>

        {/* ================= MAP ================= */}
        <div className="mb-4">
          <MapBoxView
            lat={location.lat}
            lng={location.lng}
            mode="edit"
            onSelect={setLocation}
          />
          {location.address && (
            <p className="text-sm text-gray-500 mt-1">
              📍 {location.address}
            </p>
          )}
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="destination"
            value={formData.destination}
            className="input w-full"
            onChange={handleChange}
            placeholder="Destination"
            required
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-44 w-full object-cover rounded-xl"
            />
          )}

          <div className="flex gap-3">
            <input
              type="date"
              name="startDate"
              className="input w-full"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="endDate"
              className="input w-full"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              name="budget"
              placeholder="Budget (₹)"
              className="input w-full"
              onChange={handleChange}
            />
            <input
              type="number"
              name="maxPeople"
              placeholder="Max People"
              className="input w-full"
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="description"
            className="input w-full h-28"
            placeholder="Describe your trip..."
            onChange={handleChange}
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded-full">
            Create Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
