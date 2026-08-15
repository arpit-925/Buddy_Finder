import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FiCalendar, FiMapPin, FiUsers, FiMessageCircle, FiEdit3, FiTrash2, FiArrowLeft, FiPlus, FiCompass } from "react-icons/fi";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import JoinRequests from "../components/trips/JoinRequests";
import MapBoxView from "../components/maps/MapBoxView";
import Loader from "../components/common/Loader";
import { resolveDestinationImage } from "../utils/destinationImage";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [joining, setJoining] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data);
      setNotFound(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setTrip(null);
        setNotFound(true);
      } else {
        setTrip(null);
        toast.error("We couldn't load this trip. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (notFound || !trip) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-background px-4">
        <div className="card max-w-md p-10 text-center">
          <FiCompass className="mx-auto text-3xl text-primary" />
          <h1 className="mt-4 text-2xl font-bold text-ink">Trip not found</h1>
          <p className="mt-2 text-sm text-muted">
            This trip may have been deleted or the link is incorrect.
          </p>
          <button onClick={() => navigate("/explore")} className="btn mt-6">
            Browse trips
          </button>
        </div>
      </main>
    );
  }

  const coverImage = trip.image || resolveDestinationImage(trip.destination);
  const userId = user?._id?.toString();
  const isHost = trip.createdBy?._id?.toString() === userId;
  const isJoined = trip.joinedUsers?.some((member) => member === userId || member?._id === userId);
  const requested = trip.joinRequests?.some((member) => member === userId || member?._id === userId);
  const participants = trip.joinedUsers?.length || 0;
  const closed = trip.status === "CLOSED" || participants >= trip.maxPeople;

  const join = async () => {
    try {
      setJoining(true);
      await api.post(`/trips/join/${trip._id}`);
      toast.success("Join request sent");
      fetchTrip();
    } catch (error) {
      toast.error(error.response?.data?.message || "We couldn't send your request.");
    } finally {
      setJoining(false);
    }
  };

  const remove = async () => {
    if (participants > 1) return toast.error("A trip with joined travelers can't be deleted.");
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await api.delete(`/trips/${trip._id}`);
      toast.success("Trip deleted");
      navigate("/explore");
    } catch {
      toast.error("We couldn't delete this trip.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-7 lg:grid-cols-[1fr_330px]">
          <section className="space-y-7">
            <article className="card overflow-hidden">
              {coverImage ? (
                <img src={coverImage} alt={trip.destination} className="h-64 w-full object-cover sm:h-80" />
              ) : (
                <div className="h-64 bg-ocean-gradient sm:h-80" />
              )}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} aria-label="Go back" className="p-1 rounded hover:bg-slate-100">
                      <FiArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-teal">
                        <FiMapPin />
                        {trip.location?.address || trip.destination}
                      </p>
                      <h1 className="mt-2 text-3xl font-bold text-ink">{trip.destination}</h1>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${closed ? "bg-slate-200 text-slate-700" : "bg-green-100 text-success"}`}>
                    {closed ? "CLOSED" : "OPEN"}
                  </span>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <Detail
                    icon={<FiCalendar />}
                    label="Dates"
                    value={
                      trip.startDate && trip.endDate
                        ? `${new Date(trip.startDate).toLocaleDateString()} – ${new Date(trip.endDate).toLocaleDateString()}`
                        : "Dates to be confirmed"
                    }
                  />
                  <Detail icon="₹" label="Budget" value={`₹${Number(trip.budget || 0).toLocaleString()}`} />
                  <Detail icon={<FiUsers />} label="Travelers" value={`${participants} / ${trip.maxPeople}`} />
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-bold text-ink">About this trip</h2>
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">{trip.description}</p>
                </div>
              </div>
            </article>

            {!closed && (
              <div className="mt-6">
                <button
                  onClick={() =>
                    navigate("/create-trip", {
                      state: {
                        destination: trip.destination,
                        image: trip.image || "",
                        location: trip.location,
                        startDate: trip.startDate,
                        endDate: trip.endDate,
                        budget: trip.budget,
                        maxPeople: trip.maxPeople,
                        description: trip.description,
                        travelType: trip.travelType || "",
                      },
                    })
                  }
                  className="btn w-full"
                >
                  <FiPlus />
                  Create similar trip
                </button>
              </div>
            )}

            {trip.location?.lat != null && trip.location?.lng != null && (
              <section className="card p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold text-ink">Location</h2>
                <MapBoxView lat={trip.location.lat} lng={trip.location.lng} />
              </section>
            )}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            <section className="card p-5">
              <p className="text-xs font-bold tracking-wider text-muted">HOSTED BY</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-blue-50 font-bold text-primary">
                  {trip.createdBy?.avatar ? (
                    <img src={trip.createdBy.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    trip.createdBy?.name?.[0]
                  )}
                </div>
                <div>
                  <p className="font-bold text-ink">{trip.createdBy?.name}</p>
                  <p className="text-sm text-muted">Trip host</p>
                </div>
              </div>
            </section>

            <section className="card space-y-3 p-5">
              {isHost ? (
                <>
                  <button onClick={() => navigate(`/edit-trip/${trip._id}`)} className="btn w-full">
                    <FiEdit3 />
                    Edit trip
                  </button>
                  <button
                    onClick={remove}
                    disabled={deleting}
                    className="w-full rounded-xl bg-red-50 px-4 py-2.5 font-semibold text-error hover:bg-red-100 disabled:opacity-60"
                  >
                    <FiTrash2 className="mr-2 inline" />
                    {deleting ? "Deleting..." : "Delete trip"}
                  </button>
                </>
              ) : !isJoined && !requested ? (
                <button onClick={join} disabled={joining || closed} className="btn w-full">
                  {joining ? "Sending request..." : closed ? "Trip is closed" : "Request to join"}
                </button>
              ) : requested ? (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-700">Request sent</div>
              ) : null}

              {(isHost || isJoined) && (
                <button
                  onClick={() => navigate(`/chat/${trip._id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2.5 font-semibold text-white hover:bg-teal/90"
                >
                  <FiMessageCircle />
                  Open chat
                </button>
              )}
            </section>

            {isHost && (
              <section className="card p-5">
                <h2 className="mb-4 font-bold text-ink">Join requests</h2>
                <JoinRequests trip={trip} refreshTrip={fetchTrip} />
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <span className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </span>
      <span className="mt-1 block text-sm font-bold text-ink">{value}</span>
    </div>
  );
}