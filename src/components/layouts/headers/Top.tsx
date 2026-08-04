import { Link } from "react-router";

export default function TopNav() {
  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 border p-2 h-12 ">
        <div className="flex justify-end items-center">
          <ul className="flex items-center gap-4">
            <li>
              <Link to="dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="bills">Bills</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
