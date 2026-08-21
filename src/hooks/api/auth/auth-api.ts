import http from "@c/configs/axiosHttp";
import AuthService from "@c/services/AuthService";
import type {
  PostLoginResponse,
  PostLogin,
  UserInterface,
} from "@c/types/login-types";
import type {
  PostRegister,
  PostRegisterResponse,
} from "@c/types/register-types";
import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;

export const loginAPI = async ({
  email,
  password,
}: PostLogin): Promise<PostLoginResponse> => {
  const response = await http.post<PostLoginResponse>(`login`, {
    ...{ email, password },
  });
  const user = response?.data?.user as UserInterface;

  if (response.data.user) {
    AuthService.setUserDetails(user);
  }
  return response?.data;
};

export const registerAPI = async ({
  first_name,
  last_name,
  email,
  invitation_code,
  password,
  password_confirmation,
}: PostRegister): Promise<PostRegisterResponse> => {
  const response = await http.post<PostRegisterResponse>(`register`, {
    first_name,
    last_name,
    email,
    invitation_code,
    password,
    password_confirmation,
  });
  return response?.data;
};

export const getCookies = async () => {
  const response = await axios.get(`${base_url}/sanctum/csrf-cookie`);
  return response;
};

export const authCheck = async () => {
  return await http.get("auth-check");
};

export const logoutAPI = async () => {
  const response = await http.post("logout");
  if (!response?.data) {
    return null;
  }
  AuthService.logoutUser();
  return response?.data;
};
