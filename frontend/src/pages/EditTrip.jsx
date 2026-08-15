import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrips } from "../context/TripContext";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { uploadImage } from "../utils/uploadImage";
import MapBoxView from "../components/maps/MapBoxView";
import DestinationAutocomplete from "../components/maps/DestinationAutocomplete";
import api from "../services/api";


const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTrip } = useTrips();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState(null);

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    maxPeople: "",
    description: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trips/edit/${id}`);

      const trip = res.data;

      setFormData({
        destination: trip.destination || "",
        startDate: trip.startDate?.split("T")[0] || "",
        endDate: trip.endDate?.split("T")[0] || "",
        budget: trip.budget || "",
        maxPeople: trip.maxPeople || "",
        description: trip.description || "",
      });

      setLocation(trip.location);
      setPreview(trip.image);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trip");
      navigate("/explore");
    } finally {
      setLoading(false);
    }
  };

  fetchTrip();
}, [id, navigate]);


  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const selectDestination = (picked) => {
    setLocation(picked);
    setFormData((current) => ({ ...current, destination: picked.address }));
  };

  /* ================= SAVE ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!location) {
    toast.error("Please select location");
    return;
  }

  // Validate dates
  if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
    toast.error("End date must be after start date");
    return;
  }

  // Validate budget and maxPeople as numbers
  if (formData.budget !== "" && isNaN(Number(formData.budget))) {
    toast.error("Please enter a valid budget");
    return;
  }

  if (formData.maxPeople !== "" && isNaN(Number(formData.maxPeople))) {
    toast.error("Please enter a valid maximum number of people");
    return;
  }

  try {
    setSaving(true);

    let imageUrl = preview;
    if (image) imageUrl = await uploadImage(image);

    await updateTrip(id, {
      ...formData,
      image: imageUrl,
      location,
    });

    toast.success("Trip updated successfully ✨");
    navigate(`/trip/${id}`);
  } catch {
    toast.error("Failed to update trip");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Trip ✏️
        </h2>

          {location && <>
          <DestinationAutocomplete
            value={formData.destination}
            onChange={(destination) => setFormData((current) => ({ ...current, destination }))}
            onSelect={selectDestination}
          />
          <div className="mt-4">
          <MapBoxView
            lat={location.lat}
            lng={location.lng}
            mode="edit"
            onSelect={selectDestination}
          />
          </div>
        </>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <input type="file" onChange={handleImageChange} />

          {preview && (
            <img src={preview} className="h-44 w-full object-cover rounded-xl" />
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
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="input w-full"
            />
            <input
              name="maxPeople"
              value={formData.maxPeople}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input w-full h-28"
            required
          />

          <button
            disabled={saving}
            className="w-full bg-pink-600 text-white py-2 rounded-full"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTrip;
