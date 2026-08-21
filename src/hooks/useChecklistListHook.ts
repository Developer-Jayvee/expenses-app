import { useMemo, useState } from "react";
import type { ChecklistGroupI } from "@c/types/checklistTypes";

export default function useChecklistListHook(
  groupList: Array<ChecklistGroupI>,
) {
  const [query, setQuery] = useState("");

  const onQueryChange = (value: string) => setQuery(value);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return groupList.filter((group) => {
      const matchesQuery = term
        ? group.title.toLowerCase().includes(term)
        : true;
      return matchesQuery;
    });
  }, [groupList, query]);

  return {
    query,
    onQueryChange,
    filtered,
  };
}
