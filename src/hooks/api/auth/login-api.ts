import http from "@c/configs/axiosHttp";
import LoginService from "@c/services/loginService";
import type {
  PostLoginResponse,
  PostLogin,
  UserInterface,
} from "@c/types/login-types";
import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;

export const loginAPI = async ({
  email,
  password,
}: PostLogin): Promise<PostLoginResponse> => {
  const loginService = LoginService({ user: null });
  const response = await http.post<PostLoginResponse>(`login`, {
    ...{ email, password },
  });
  const user = response?.data?.user as UserInterface;

  if (response.data.user) {
    loginService.setUserDetails(user);
  }
  return response?.data;
};

export const getCookies = async () => {
  return await axios.get(`${base_url}/sanctum/csrf-cookie`);
};

export const authCheck = async () => {
  return await http.get("auth-check");
};
