import API from "./axios";

export const signup = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await API.post("/auth/signup", data);
  return res.data;
};

export const login = async (data: {
  emailOrUsername: string;
  password: string;
}) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};
