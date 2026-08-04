import { IoGridOutline } from "react-icons/io5";
import { NavLink } from "react-router";
import { MdNewspaper } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

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
              <div className="rounded-full font-bold profile-icon-bg w-10 h-10 text-sm flex items-center justify-center">
                <p>JV</p>
              </div>
            </div>
            <div className="flex justify-between w-full items-center">
              <div>
                <p className="-mb-2.5 text-sm font-bold">Jayvee Hidlao</p>
                <small className="">jayvee@gmail.com</small>
              </div>
              <div>
                <button>
                  <HiOutlineDotsHorizontal />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
