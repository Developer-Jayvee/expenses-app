import TopBar from "@c/components/layouts/headers/Top";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-blue-50">
      <TopBar />
      <main className="pt-14 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
