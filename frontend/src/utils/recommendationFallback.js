import { suggestedPlaces } from "../data/suggestedPlaces";

const ranges = { low: "From ₹8,000", medium: "From ₹15,000", high: "From ₹30,000" };
const budgetNumbers = { low: 10000, medium: 20000, high: 40000 };
const descriptions = { beach: "A relaxed escape for beach days, social plans and easy weekends.", mountain: "Fresh mountain air, scenic stays and a break from the everyday.", adventure: "Made for active days, remarkable views and a little more adventure.", city: "Culture, food and city experiences with plenty to discover.", spiritual: "A slower, meaningful journey with nature and local culture." };

// Isolated fallback until a recommendation endpoint is introduced.
export function getRecommendationFallback(preferences = {}) {
  const seasonMatches = suggestedPlaces.filter((place) => !preferences.season || place.season?.includes(preferences.season));
  const typeMatches = seasonMatches.filter((place) => !preferences.travelType || place.type === preferences.travelType);
  const pool = typeMatches.length ? typeMatches : seasonMatches.length ? seasonMatches : suggestedPlaces;
  return pool.slice(0, 6).map((place, index) => ({
    destination: place.name,
    image: place.image,
    location: { lat: place.lat, lng: place.lng, address: place.name },
    matchScore: Math.max(82, 96 - index * 3),
    description: descriptions[place.type] || "A destination selected around your travel preferences.",
    reasons: [place.type || "Travel", place.budgetRange === "low" ? "Budget friendly" : "Within budget", preferences.season ? `${preferences.season} season` : "Flexible dates"],
    estimatedBudget: ranges[place.budgetRange] || "Budget on request",
    duration: place.type === "city" ? "3–4 days" : "4–5 days",
    type: place.type || "",
    season: place.season?.[0] || "",
    budget: budgetNumbers[place.budgetRange] || 20000,
  }));
}