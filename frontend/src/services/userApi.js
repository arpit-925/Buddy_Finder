import api from "./api";

export const updateProfileApi = (data) =>
  api.put("/users/update-profile", data);
