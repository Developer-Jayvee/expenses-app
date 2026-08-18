import type { UserInterface } from "./login-types";

export const ACTIVITY_PAGE_SIZE = 10;

export type ActivityTypeI =
  "bill_created" | "bill_updated" | "payment_logged" | "payment_deleted";

export interface ActivityResourceI {
  id: string | number;
  bills_id: string | number;
  user: UserInterface | null;
  type: {
    value: ActivityTypeI;
    label: string;
  };
  description: string;
  created_at: string;
}

export interface ActivityMetaI {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
}

export interface ActivityListParamsI {
  page?: number;
  per_page?: number;
}

export interface ActivityListResponseI {
  items: ActivityResourceI[];
  meta: ActivityMetaI;
}
