import { NavLink } from "react-router";

const SUB_NAV_LINKS = [
  { to: "/expense/checklist", label: "Checklist" },
  { to: "/expense/daily-expenses", label: "Expenses List" },
];

export default function ChecklistExpenseNav() {
  return (
    <nav>
      <ul className="flex items-center gap-1">
        {SUB_NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60"
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
