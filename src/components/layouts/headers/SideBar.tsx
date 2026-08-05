import { IoGridOutline } from "react-icons/io5";
import { NavLink } from "react-router";
import { MdNewspaper } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import DropMenu from "@c/components/ui/DropMenu";
import useAuthHook from "@c/hooks/useAuthHook";
import { ModalContextService } from "@c/context/ModalContext";
import AuthService from "@c/services/AuthService";

const LinkComponent = ({
  children,
  linkTo,
}: {
  children: React.ReactNode;
  linkTo: string;
}) => {
  return (
    <NavLink
      to={linkTo}
      className="rounded-lg p-2 pl-3 text-white font-medium flex items-center gap-2 text-lg  secondary "
    >
      {children}
    </NavLink>
  );
};

export default function SideBar() {
  const { onLogout } = useAuthHook();
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
    <aside className="fixed top-0 bottom-0 w-67.5 text-white">
      <div className="h-full w-full flex flex-col p-6 gap-10">
        <div className="">
          <h1 className="text-xl font-bold">Budget Expenses</h1>
        </div>
        <div className="grow-2">
          <ul>
            <li>
              <LinkComponent linkTo="dashboard">
                <IoGridOutline />
                <h2>Dashboard</h2>
              </LinkComponent>
            </li>
            <li>
              <LinkComponent linkTo="bills">
                <MdNewspaper />
                <h2>Bills</h2>
              </LinkComponent>
            </li>
          </ul>
        </div>
        <div className="border-0 border-t">
          <div className="flex gap-3 mt-3">
            <div>
              <img
                src="https://api.dicebear.com/10.x/bottts/png"
                className="rounded-full font-bold profile-icon-bg w-10 h-10 text-sm flex items-center justify-center"
              />
            </div>
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
          </div>
        </div>
      </div>
    </aside>
  );
}
