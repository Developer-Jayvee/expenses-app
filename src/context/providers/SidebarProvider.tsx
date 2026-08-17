import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";

const COLLAPSE_BREAKPOINT = 1024;

interface SidebarContextI {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextI | null>({
  isCollapsed: false,
  toggleSidebar: () => {},
});

export const useSidebar = () =>
  useContextProvider<SidebarContextI>(SidebarContext);

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSmallScreen = () =>
    typeof window !== "undefined" && window.innerWidth < COLLAPSE_BREAKPOINT;

  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);
  const wasSmallScreen = useRef(isSmallScreen());

  useEffect(() => {
    const handleResize = () => {
      const small = isSmallScreen();
      if (small !== wasSmallScreen.current) {
        wasSmallScreen.current = small;
        setIsCollapsed(small);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const value = useMemo<SidebarContextI>(
    () => ({
      isCollapsed,
      toggleSidebar: () => setIsCollapsed((prev) => !prev),
    }),
    [isCollapsed],
  );

  return (
    <ContextProvider<SidebarContextI | null>
      context={SidebarContext}
      values={value}
    >
      {children}
    </ContextProvider>
  );
}
