import { useEffect } from "react";
import { useParams } from "react-router";
import useActivityHook from "@c/hooks/useActivityHook";
import { ACTIVITY_PAGE_SIZE } from "@c/types/activityTypes";
import ActivityList from "../components/ActivityLog/activityList";
import ActivityPagination from "../components/ActivityLog/activityPagination";

export default function BillActivity() {
  const { id } = useParams();
  const { resource, meta, getActivities } = useActivityHook();

  useEffect(() => {
    if (id) {
      getActivities(id, { page: 1, per_page: ACTIVITY_PAGE_SIZE });
    }
  }, [id]);

  const goToPage = (nextPage: number) => {
    if (!id) return;
    getActivities(id, { page: nextPage, per_page: ACTIVITY_PAGE_SIZE });
  };

  return (
    <div className="w-full">
      <div className="border-b px-5 py-3.5">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Activity
        </span>
      </div>
      <ActivityList list={resource} />
      <ActivityPagination meta={meta} onPageChange={goToPage} />
    </div>
  );
}
