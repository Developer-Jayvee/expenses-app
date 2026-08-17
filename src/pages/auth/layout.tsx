import SideBar from "@c/components/layouts/headers/SideBar";
import SidebarProvider, {
  useSidebar,
} from "@c/context/providers/SidebarProvider";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayoutContent({ children }: AuthLayoutProps) {
  const { isCollapsed } = useSidebar();
  return (
    <div className="w-full h-screen bg-blue-50">
      <SideBar />
      <main
        className={`transition-[margin-left] duration-200 ${
          isCollapsed ? "ml-20" : "ml-67.5"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SidebarProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </SidebarProvider>
  );
}
