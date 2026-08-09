import type { OptionTypes, ReferenceResponseI } from "@c/types/globalTypes";
import { useEffect, useState } from "react";
import { reference_API } from "./api/reference-api";

export default function useReferenceHook() {
  const [references, setReferences] = useState<{
    category?: Array<ReferenceResponseI>;
    payments?: Array<ReferenceResponseI>;
  } | null>(null);

  const getReferences = async (type: OptionTypes) => {
    const response = await reference_API(type);
    if (response) {
      setReferences((prev) => ({
        ...prev,
        type: response,
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
