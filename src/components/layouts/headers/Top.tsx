import { IoGridOutline } from "react-icons/io5";
import { MdChecklist, MdNewspaper, MdOutlineReceiptLong } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { NavLink } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@c/lib/shadcn/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@c/lib/shadcn/components/ui/avatar";
import useAuthHook from "@c/hooks/useAuthHook";
import LoadingScreen from "@c/components/LoadingScreen";
import { ModalContextService } from "@c/context/ModalContext";
import AuthService from "@c/services/AuthService";
import { Badge } from "@c/lib/shadcn/components/ui/badge";
import { useToast } from "@c/context/providers/ToastProvider";

const NAV_LINKS = [
  { to: "dashboard", label: "Dashboard", icon: IoGridOutline },
  { to: "bills", label: "Bills", icon: MdNewspaper },
  { to: "daily-expenses", label: "Daily Expenses", icon: MdOutlineReceiptLong },
  { to: "checklist", label: "Checklist", icon: MdChecklist },
];

export default function TopBar() {
  const { onLogout, isRedirecting } = useAuthHook();
  const { onOpen, confirmModalConfig, handleConfirm } =
    ModalContextService.confirmModal();
  const user = AuthService.getUserData();
  const { showToast } = useToast();

  const handleCopyGroupCode = async () => {
    if (!user?.group_code) return;
    try {
      await navigator.clipboard.writeText(user.group_code);
      showToast({
        message: "Group code copied to clipboard.",
        variant: "success",
      });
    } catch {
      showToast({
        message: "Failed to copy group code.",
        variant: "danger",
      });
    }
  };

  const confirmLogout = () => {
    onOpen();
    confirmModalConfig({
      title: "Are you sure you want to logout?",
    });
    handleConfirm(() => onLogout());
  };

  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");
  const initials =
    `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();

  if (isRedirecting) {
    return <LoadingScreen message="Signing you out..." />;
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-2 border-b bg-card px-3 sm:gap-4 sm:px-5">
        <div className="flex items-center gap-3 sm:gap-6">
          <h1 className="flex items-center gap-2 text-sm font-bold tracking-tight sm:text-base">
            <img src="/favicon.svg" alt="Coinpath" className="h-5 w-5" />
            Coinpath
          </h1>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`
                    }
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user?.group_code && (
            <Badge
              render={<button type="button" />}
              variant="outline"
              className="cursor-pointer whitespace-nowrap"
              onClick={handleCopyGroupCode}
            >
              <span className="hidden sm:inline">GROUP CODE: </span>
              {user.group_code}
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger className="h-auto! w-auto! rounded-full! border-none! bg-transparent! p-0! shadow-none!">
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://api.dicebear.com/10.x/bottts/png"
                  alt={fullName || "User avatar"}
                />
                <AvatarFallback className="text-xs font-bold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {fullName || "Account"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => confirmLogout()}>
                  <HiOutlineLogout size={15} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }
          >
            <Icon size={20} />
            {label === "Daily Expenses" ? "Daily" : label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
