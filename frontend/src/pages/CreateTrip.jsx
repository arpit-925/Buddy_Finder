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

  // ✅ SAFE location state
  const { state: locationState } = useLocation();

  /* ================= STATE ================= */
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(locationState?.image || "");

  // ✅ RENAMED (no router conflict)
  const [tripLocation, setTripLocation] = useState(
    locationState?.location || {
      lat: 28.6139, // Delhi default
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

  /* ================= AUTO FILL ================= */
  useEffect(() => {
    if (!locationState) return;

    if (locationState.destination) {
      setFormData((prev) => ({
        ...prev,
        destination: locationState.destination,
      }));
    }

    if (locationState.location) {
      setTripLocation(locationState.location);
    }

    if (locationState.image) {
      setPreview(locationState.image);
    }
  }, [locationState]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be under 2MB");
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tripLocation?.lat || !tripLocation?.lng) {
      return toast.error("Please select a trip location");
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return toast.error("End date must be after start date");
    }

    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImage(image);
      } else if (preview?.startsWith("http")) {
        imageUrl = preview;
      }
// Inside handleSubmit, right before await createTrip(...)
console.log("Saving trip with Image URL:", imageUrl);
      await createTrip({
        ...formData,
        budget: Number(formData.budget),
        maxPeople: Number(formData.maxPeople),
        image: imageUrl,
        location: tripLocation,
      });

      toast.success("Trip created successfully 🎉");
      navigate("/explore");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create trip");
    }
  };

  if (loading) return <Loader fullScreen />;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create a New Trip ✈️
        </h2>

        {/* MAP */}
        <div className="mb-4">
          <MapBoxView
            lat={tripLocation?.lat ?? 28.6139}
            lng={tripLocation?.lng ?? 77.209}
            mode="edit"
            onSelect={setTripLocation}
          />

          {tripLocation.address && (
            <p className="text-sm text-gray-500 mt-1">
              📍 {tripLocation.address}
            </p>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Destination"
            className="input w-full"
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
              value={formData.startDate}
              onChange={handleChange}
              className="input w-full"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Budget (₹)"
              className="input w-full"
            />
            <input
              type="number"
              name="maxPeople"
              value={formData.maxPeople}
              onChange={handleChange}
              placeholder="Max People"
              className="input w-full"
              required
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your trip..."
            className="input w-full h-28"
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
