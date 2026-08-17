import { IoGridOutline } from "react-icons/io5";
import { NavLink } from "react-router";
import { MdNewspaper } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import DropMenu from "@c/components/ui/DropMenu";
import useAuthHook from "@c/hooks/useAuthHook";
import { ModalContextService } from "@c/context/ModalContext";
import AuthService from "@c/services/AuthService";
import { useSidebar } from "@c/context/providers/SidebarProvider";

const LinkComponent = ({
  children,
  linkTo,
  isCollapsed,
  title,
}: {
  children: React.ReactNode;
  linkTo: string;
  isCollapsed: boolean;
  title: string;
}) => {
  return (
    <NavLink
      to={linkTo}
      title={isCollapsed ? title : undefined}
      className={`rounded-lg p-2 text-white font-medium flex items-center gap-2 text-lg secondary ${
        isCollapsed ? "justify-center" : "pl-3"
      }`}
    >
      {children}
    </NavLink>
  );
};

export default function SideBar() {
  const { onLogout } = useAuthHook();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { onOpen, handleConfirm, confirmModalConfig } =
    ModalContextService.confirmModal();
  const confirmLogout = () => {
    onOpen();
    confirmModalConfig({
      title: "Are you sure you want to logout?",
    });
    handleConfirm(() => onLogout());
  };
  const user = AuthService.getUserData();
  return (
    <aside
      className={`fixed top-0 bottom-0 text-white transition-[width] duration-200 ${
        isCollapsed ? "w-20" : "w-67.5"
      }`}
    >
      <div className="h-full w-full flex flex-col p-4 gap-10">
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed && (
            <h1 className="text-xl font-bold truncate">Budget Expenses</h1>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="shrink-0 text-white/80 hover:text-white cursor-pointer p-1 rounded"
          >
            {isCollapsed ? (
              <TbLayoutSidebarLeftExpand size={22} />
            ) : (
              <TbLayoutSidebarLeftCollapse size={22} />
            )}
          </button>
        </div>
        <div className="grow-2">
          <ul className="flex flex-col gap-1">
            <li>
              <LinkComponent
                linkTo="dashboard"
                isCollapsed={isCollapsed}
                title="Dashboard"
              >
                <IoGridOutline />
                {!isCollapsed && <h2>Dashboard</h2>}
              </LinkComponent>
            </li>
            <li>
              <LinkComponent
                linkTo="bills"
                isCollapsed={isCollapsed}
                title="Bills"
              >
                <MdNewspaper />
                {!isCollapsed && <h2>Bills</h2>}
              </LinkComponent>
            </li>
          </ul>
        </div>
        <div className="border-0 border-t">
          <div
            className={`flex mt-3 ${
              isCollapsed ? "flex-col items-center gap-2" : "gap-3"
            }`}
          >
            <div>
              <img
                src="https://api.dicebear.com/10.x/bottts/png"
                className="rounded-full font-bold profile-icon-bg w-10 h-10 text-sm flex items-center justify-center"
              />
            </div>
            {!isCollapsed && (
              <div className="flex justify-between w-full items-center">
                <div>
                  <p className="-mb-2.5 text-sm font-bold">{user?.last_name}</p>
                  <small className="">{user?.email}</small>
                </div>
                <div>
                  <DropMenu
                    options={[
                      {
                        items: [
                          {
                            label: "Logout",
                            event: () => confirmLogout(),
                          },
                        ],
                      },
                    ]}
                  >
                    <HiOutlineDotsHorizontal />
                  </DropMenu>
                </div>
              </div>
            )}
            {isCollapsed && (
              <DropMenu
                options={[
                  {
                    items: [
                      {
                        label: "Logout",
                        event: () => confirmLogout(),
                      },
                    ],
                  },
                ]}
              >
                <HiOutlineDotsHorizontal />
              </DropMenu>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
