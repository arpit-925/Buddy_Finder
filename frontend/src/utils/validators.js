export const isEmailValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isPasswordStrong = (password) => {
  return password.length >= 6;
};

export const isTripFormValid = (data) => {
  const requiredFields = [
    "destination",
    "startDate",
    "endDate",
    "maxPeople",
    "description",
  ];

  return requiredFields.every((field) => data[field]);
};
