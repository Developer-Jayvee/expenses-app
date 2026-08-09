import http from "@c/configs/axiosHttp";
import type {
  DefaultResponseI,
  OptionTypes,
  ReferenceResponseI,
} from "@c/types/globalTypes";

const REFERENCE_URL = "options";

export const reference_API = async (type: OptionTypes) => {
  const response = await http.get<DefaultResponseI<ReferenceResponseI[]>>(
    `${REFERENCE_URL}/${type}`,
  );
  console.log(response?.data);
  return response?.data;
};
