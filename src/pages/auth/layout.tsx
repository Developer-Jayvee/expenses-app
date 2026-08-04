import SideBar from "@c/components/layouts/headers/SideBar";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full h-screen bg-blue-50">
      <SideBar />
      <main className="ml-67.5">{children}</main>
    </div>
  );
}
