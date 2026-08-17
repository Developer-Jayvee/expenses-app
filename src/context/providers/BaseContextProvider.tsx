import { useContext, type Context, type ReactNode } from "react";

interface ProviderI<T> {
  children: ReactNode;
  context: Context<T>;
  values: T;
}

export function useContextProvider<T>(ContextProvider: Context<T | null>): T {
  const context = useContext(ContextProvider);
  if (!context) {
    alert("Component is out of scope.");
    console.warn("Component is out of scope.");
  }
  return context as T;
}
export function ContextProvider<T>({
  children,
  context,
  values,
}: ProviderI<T>) {
  const ContextProvider = context;

  return (
    <ContextProvider.Provider value={values}>
      {children}
    </ContextProvider.Provider>
  );
}
