import { FiArrowRight, FiClock, FiCreditCard, FiStar } from "react-icons/fi";
import { resolveDestinationImage } from "../../utils/destinationImage";

export default function AIRecommendationCard({ recommendation, onCreateTrip }) {
  const coverImage = recommendation.image || resolveDestinationImage(recommendation.destination);
  return (
    <article className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 bg-blue-50">
        {coverImage ? (
          <img src={coverImage} alt={recommendation.destination} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full bg-ocean-gradient" />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm">
          <FiStar />
          AI MATCHED
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-white">
          {recommendation.matchScore}% MATCH
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-ink">{recommendation.destination}</h3>
        <p className="mt-2 min-h-10 text-sm leading-5 text-muted">{recommendation.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {recommendation.reasons.map((reason) => (
            <span key={reason} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-primary">
              {reason}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <FiCreditCard className="text-teal" />
            {recommendation.estimatedBudget}
          </span>
          <span className="flex items-center gap-1.5 text-muted">
            <FiClock />
            {recommendation.duration}
          </span>
        </div>
        <button type="button" onClick={() => onCreateTrip(recommendation)} className="btn mt-5 w-full gap-2">
          Create trip <FiArrowRight />
        </button>
      </div>
    </article>
  );
}