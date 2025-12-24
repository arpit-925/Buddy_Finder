/* Capitalize first letter */
export const capitalize = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1);

/* Check if user joined trip */
export const isUserJoined = (trip, userId) => {
  return trip?.joinedUsers?.includes(userId);
};

/* Generate initials for avatar */
export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
