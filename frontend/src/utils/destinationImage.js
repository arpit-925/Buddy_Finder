import { suggestedPlaces } from "../data/suggestedPlaces";

/* =========================================================
   Destination image resolution
   Priority used when creating a trip:
     1. User-uploaded image
     2. Destination-based image (curated travel imagery)
     3. Default travel placeholder
   If an AI image-generation service is configured later, wire
   it in here WITHOUT exposing any API key in frontend code.
========================================================= */

export const DEFAULT_TRAVEL_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";

/* Curated destinations not present in suggestedPlaces */
const EXTRA_DESTINATION_IMAGES = {
  kashmir: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800",
  srinagar: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800",
  "gulmarg": "https://images.unsplash.com/photo-1471967183320-ee018f6e114a?auto=format&fit=crop&w=800",
  "leh": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800",
  "darjeeling": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800",
  "ooty": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800",
  "coorg": "https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&w=800",
  "chennai": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800",
  "kolkata": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800",
  "agra": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800",
  "shimla": "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800",
};

const DESTINATION_IMAGE_MAP = suggestedPlaces.reduce((map, place) => {
  map[place.name.toLowerCase()] = place.image;
  return map;
}, EXTRA_DESTINATION_IMAGES);

const normalize = (destination = "") => destination.trim().toLowerCase();

/* Resolve a destination-appropriate travel image URL. */
export function resolveDestinationImage(destination) {
  if (!destination) return DEFAULT_TRAVEL_IMAGE;

  const key = normalize(destination);

  if (DESTINATION_IMAGE_MAP[key]) return DESTINATION_IMAGE_MAP[key];

  /* Loose match: "New Delhi" should resolve to "delhi" etc. */
  const partial = Object.keys(DESTINATION_IMAGE_MAP).find(
    (candidate) => key.includes(candidate) || candidate.includes(key)
  );
  if (partial) return DESTINATION_IMAGE_MAP[partial];

  return DEFAULT_TRAVEL_IMAGE;
}

/* Prompt template used if a real AI image service is connected later. */
export function buildDestinationImagePrompt(destination) {
  return `Create a high-quality realistic travel photograph representing ${destination}. Show the most recognizable natural landscapes, landmarks, culture, or scenery associated with ${destination}. Make it visually attractive and suitable as a modern travel website trip-card cover image. Landscape composition, cinematic natural lighting, realistic photography, no text, no logos, no watermark, no people in awkward or distorted poses.`;
}