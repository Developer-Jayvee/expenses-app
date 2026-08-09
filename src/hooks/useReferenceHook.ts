import type { OptionTypes, ReferenceResponseI } from "@c/types/globalTypes";
import { useEffect, useState } from "react";
import { reference_API } from "./api/reference-api";
import { LocalStorageClass } from "@c/utils/localStorage.util";

export default function useReferenceHook() {
  const [references, setReferences] = useState<{
    category?: Array<ReferenceResponseI>;
    payments?: Array<ReferenceResponseI>;
  } | null>(null);

  const getReferences = async (type: OptionTypes) => {
    if (!LocalStorageClass.isAlreadyStored(`reference_${type}`)) {
      const response = await reference_API(type);
      if (response) {
        setReferences((prev) => ({
          ...prev,
          [type]: response,
        }));
        LocalStorageClass.store(`reference_${type}`, JSON.stringify(response));
      }
    } else {
      setReferences((prev) => ({
        ...prev,
        [type]: JSON.parse(
          LocalStorageClass.getValue(`reference_${type}`) ?? "",
        ),
      }));
    }
  };
  useEffect(() => {
    Promise.all([getReferences("category"), getReferences("payments")]);
  }, []);

  return {
    references,
  };
}
