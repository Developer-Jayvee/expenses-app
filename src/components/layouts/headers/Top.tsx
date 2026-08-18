import { IoGridOutline } from "react-icons/io5";
import { MdNewspaper, MdOutlineReceiptLong } from "react-icons/md";
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
import { ModalContextService } from "@c/context/ModalContext";
import AuthService from "@c/services/AuthService";

const NAV_LINKS = [
  { to: "dashboard", label: "Dashboard", icon: IoGridOutline },
  { to: "bills", label: "Bills", icon: MdNewspaper },
  { to: "daily-expenses", label: "Daily Expenses", icon: MdOutlineReceiptLong },
];

export default function TopBar() {
  const { onLogout } = useAuthHook();
  const { onOpen, confirmModalConfig, handleConfirm } =
    ModalContextService.confirmModal();
  const user = AuthService.getUserData();

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

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-card px-5">
      <div className="flex items-center gap-6">
        <h1 className="text-base font-bold tracking-tight">Budget Expenses</h1>
        <nav>
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
    </header>
  );
}
