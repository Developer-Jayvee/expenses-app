import { useState } from "react";
import type {
  ActivityListParamsI,
  ActivityMetaI,
  ActivityResourceI,
} from "@c/types/activityTypes";
import { billActivities_API } from "./api/activity-api";

export default function useActivityHook() {
  const [resource, setResource] = useState<ActivityResourceI[] | null>(null);
  const [meta, setMeta] = useState<ActivityMetaI | null>(null);

  const getActivities = async (id: string, params?: ActivityListParamsI) => {
    const response = await billActivities_API(id, params);
    if (response) {
      setResource(response.items);
      setMeta(response.meta);
    } else {
      setResource(null);
      setMeta(null);
    }
  };

  return {
    resource,
    meta,
    getActivities,
  };
}
