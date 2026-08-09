import { createContext } from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";
import useReferenceHook from "@c/hooks/useReferenceHook";
import type { OptionTypes, ReferenceResponseI } from "@c/types/globalTypes";

interface ReferenceProviderI {
  references: Record<OptionTypes, Array<ReferenceResponseI> | undefined> | null;
}
const ReferenceContext = createContext<ReferenceProviderI | null>({
  references: null,
});

export const useReferenceProvider = () =>
  useContextProvider<ReferenceProviderI>(ReferenceContext);

export const ReferenceContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { references } = useReferenceHook();
  console.log(references);
  const value: Record<OptionTypes, Array<ReferenceResponseI> | undefined> = {
    category: references?.category ?? undefined,
    payments: references?.payments ?? undefined,
  };

  return (
    <ContextProvider<ReferenceProviderI | null>
      context={ReferenceContext}
      values={{
        references: value,
      }}
    >
      {children}
    </ContextProvider>
  );
};
