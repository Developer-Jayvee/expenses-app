import http from "@c/configs/axiosHttp";
import type {
  ActivityListParamsI,
  ActivityListResponseI,
} from "@c/types/activityTypes";

export const BASE_ACTIVITY_URL = "bills";

export const billActivities_API = async (
  billId: string,
  params?: ActivityListParamsI,
): Promise<ActivityListResponseI> => {
  const response = await http.get(`${BASE_ACTIVITY_URL}/${billId}/activities`, {
    params,
  });
  return response?.data;
};
