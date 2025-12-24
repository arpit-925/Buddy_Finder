export const recommendTrips = ({
  trips,
  suggestedPlaces,
  userPreferences,
}) => {
  const { budget, travelType, season } = userPreferences;

  // 1️⃣ Filter created trips
  const recommendedTrips = trips.filter((trip) => {
    if (trip.budget > budget) return false;

    if (
      travelType &&
      !trip.destination.toLowerCase().includes(travelType)
    ) {
      return true; // keep loose match
    }

    return true;
  });

  // 2️⃣ Filter suggested places
  const recommendedPlaces = suggestedPlaces.filter((place) => {
    if (!place.season.includes(season)) return false;
    if (place.budget && place.budget > budget) return false;
    if (place.type && place.type !== travelType) return false;
    return true;
  });

  return {
    trips: recommendedTrips.slice(0, 6),
    places: recommendedPlaces.slice(0, 6),
  };
};
