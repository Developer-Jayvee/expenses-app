import type { ActivityResourceI, ActivityTypeI } from "@c/types/activityTypes";
import {
  MdOutlineAddCircle,
  MdOutlineEdit,
  MdOutlinePayments,
  MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import type { ReactNode } from "react";

const ACTIVITY_ICONS: Record<ActivityTypeI, ReactNode> = {
  bill_created: <MdOutlineAddCircle className="text-emerald-500" size={18} />,
  bill_updated: <MdOutlineEdit className="text-blue-500" size={18} />,
  payment_logged: <MdOutlinePayments className="text-primary" size={18} />,
  payment_deleted: (
    <MdOutlineRemoveCircleOutline className="text-red-500" size={18} />
  ),
};

interface ActivityListI {
  list: ActivityResourceI[] | null;
}

export default function ActivityList({ list }: ActivityListI) {
  if (!list || list.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-muted-foreground">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {list.map((activity) => (
        <li key={activity.id} className="flex items-start gap-3 px-5 py-3.5">
          <span className="mt-0.5">{ACTIVITY_ICONS[activity.type.value]}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {activity.user
                ? `${activity.user.first_name} ${activity.user.last_name}`
                : "System"}{" "}
              · {new Date(activity.created_at).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
