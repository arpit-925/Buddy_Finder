import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTrips } from "../context/TripContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { uploadImage } from "../utils/uploadImage";
import { resolveDestinationImage } from "../utils/destinationImage";
import MapBoxView from "../components/maps/MapBoxView";
import DestinationAutocomplete from "../components/maps/DestinationAutocomplete";

const normalizeType = (value = "") => value.toLowerCase();
const parseBudget = (value) => (value === "" || value === undefined || value === null ? "" : String(value));

export default function CreateTrip() {
  const { createTrip, loading } = useTrips();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(state?.image || "");
  const [location, setLocation] = useState(state?.location || null);
  const [creating, setCreating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [prefilledDestination, setPrefilledDestination] = useState(state?.destination || "");

  const [form, setForm] = useState({
    destination: state?.destination || "",
    startDate: state?.startDate || "",
    endDate: state?.endDate || "",
    budget:
      state?.budget !== undefined
        ? parseBudget(state?.budget)
        : user?.preferences?.budget
        ? String(user.preferences.budget)
        : "",
    maxPeople: state?.maxPeople !== undefined ? String(state.maxPeople) : "",
    description: state?.description || "",
    travelType:
      state?.travelType || normalizeType(user?.preferences?.travelType) || "",
    season: state?.season || user?.preferences?.season || "",
  });

  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const choosePlace = (picked) => {
    setLocation(picked);
    setForm((current) => ({ ...current, destination: picked.address }));
    if (picked.address !== prefilledDestination) {
      setImage(null);
      setPreview("");
    }
  };

  const pickImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* Resolve final cover image.
     Priority: user upload -> pre-filled/preview URL -> destination image -> placeholder */
  const resolveCoverImage = async () => {
    if (image) return uploadImage(image);
    if (preview?.startsWith("http")) return preview;
    setGeneratingImage(true);
    try {
      return resolveDestinationImage(form.destination);
    } finally {
      setGeneratingImage(false);
    }
  };

  const validate = () => {
    if (!form.destination.trim()) {
      toast.error("Destination is required");
      return false;
    }
    if (!location?.lat || !location?.lng) {
      toast.error("Choose a destination from search or the map");
      return false;
    }
    if (!form.startDate) {
      toast.error("Please choose a start date");
      return false;
    }
    if (!form.endDate) {
      toast.error("Please choose an end date");
      return false;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return false;
    }
    if (!form.maxPeople || Number(form.maxPeople) < 1) {
      toast.error("Travelers must be at least 1");
      return false;
    }
    if (form.budget !== "" && (isNaN(Number(form.budget)) || Number(form.budget) < 0)) {
      toast.error("Please enter a valid budget");
      return false;
    }
    if (!form.description.trim()) {
      toast.error("Please describe your trip");
      return false;
    }
    return true;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    if (creating || loading) return;

    setCreating(true);
    try {
      const imageUrl = await resolveCoverImage();
      const newTrip = await createTrip({
        ...form,
        budget: Number(form.budget || 0),
        maxPeople: Number(form.maxPeople),
        image: imageUrl,
        location,
      });
      toast.success("Trip created successfully");
      navigate("/explore", { state: { createdTripId: newTrip?._id } });
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      const message = Array.isArray(backendErrors)
        ? backendErrors[0]
        : error.response?.data?.message || "We couldn't save your trip. Please try again.";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const busy = creating || loading;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-teal">PLAN A NEW ADVENTURE</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">Create your trip</h1>
        </div>

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-5">
          <section className="card space-y-5 p-5 sm:p-7 lg:col-span-3">
            <div>
              <h2 className="text-lg font-bold text-ink">Destination</h2>
              <p className="mt-1 text-sm text-muted">Select a suggestion to pin the exact trip location.</p>
            </div>

            <DestinationAutocomplete
              value={form.destination}
              onChange={(destination) => setForm((current) => ({ ...current, destination }))}
              onSelect={choosePlace}
            />

            <MapBoxView
              lat={location?.lat}
              lng={location?.lng}
              address={location?.address}
              mode="edit"
              onSelect={choosePlace}
            />

            {location?.address && (
              <p className="rounded-xl bg-teal/10 px-3 py-2 text-sm text-teal">Location selected: {location.address}</p>
            )}
          </section>

          <section className="card space-y-5 p-5 sm:p-7 lg:col-span-2">
            <div>
              <h2 className="text-lg font-bold text-ink">Trip details</h2>
              {user && (
                <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-blue-50 text-[11px] font-bold text-primary">
                    {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user.name?.[0]}
                  </span>
                  Creating as {user.name} · {user.email}
                </p>
              )}
            </div>

            <label className="block text-sm font-medium text-ink">
              Cover image
              <input
                type="file"
                accept="image/*"
                onChange={pickImage}
                className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-primary"
              />
            </label>

            {preview && <img src={preview} alt="Trip cover preview" className="h-40 w-full rounded-xl object-cover" />}

            {!image && !preview && (
              <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-primary">
                No image yet — a destination-appropriate cover image will be added automatically.
              </p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm font-medium text-ink">
                Start date
                <input required type="date" name="startDate" value={form.startDate} onChange={change} className="input mt-1" />
              </label>
              <label className="text-sm font-medium text-ink">
                End date
                <input required type="date" name="endDate" value={form.endDate} onChange={change} className="input mt-1" />
              </label>
              <label className="text-sm font-medium text-ink">
                Travel type
                <select name="travelType" value={form.travelType} onChange={change} className="input mt-1">
                  <option value="">Any type</option>
                  <option value="mountain">Mountain</option>
                  <option value="beach">Beach</option>
                  <option value="city">City</option>
                  <option value="adventure">Adventure</option>
                  <option value="spiritual">Spiritual</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-ink">
              Season
              <select name="season" value={form.season} onChange={change} className="input mt-1">
                <option value="">Flexible</option>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
                <option value="monsoon">Monsoon</option>
                <option value="spring">Spring</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium text-ink">
                Budget (₹)
                <input type="number" min="0" name="budget" value={form.budget} onChange={change} className="input mt-1" placeholder="15000" />
              </label>
              <label className="text-sm font-medium text-ink">
                Travelers
                <input required type="number" min="1" name="maxPeople" value={form.maxPeople} onChange={change} className="input mt-1" placeholder="4" />
              </label>
            </div>

            <label className="block text-sm font-medium text-ink">
              About this trip
              <textarea required name="description" value={form.description} onChange={change} className="input mt-1 min-h-32 resize-y" placeholder="What makes this trip special?" />
            </label>

            <button disabled={busy} className="btn w-full">
              {creating
                ? generatingImage
                  ? "Generating destination image..."
                  : "Creating trip..."
                : "Create trip"}
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}