import { IoGridOutline } from "react-icons/io5";
import { MdNewspaper, MdOutlineReceiptLong } from "react-icons/md";
import { HiOutlineShieldCheck } from "react-icons/hi";

const FEATURE_HIGHLIGHTS = [
  {
    icon: MdNewspaper,
    label: "Bills tracked automatically",
    description:
      "Recurring bills, due dates, and payment history in one place.",
  },
  {
    icon: MdOutlineReceiptLong,
    label: "Daily budgets that adapt",
    description: "Set a budget for the day and log expenses as you spend.",
  },
  {
    icon: IoGridOutline,
    label: "One dashboard, full picture",
    description: "See what's due, what's spent, and what's left at a glance.",
  },
];

interface AuthSplitLayoutProps {
  children: React.ReactNode;
}

export default function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[var(--sidebar-bg)] p-11 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="profile-icon-bg flex size-7 items-center justify-center rounded-lg font-bold">
            $
          </div>
          <span className="text-base font-bold tracking-tight">
            Budget Expenses
          </span>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
            Every bill, every expense, one running total.
          </h2>
          <ul className="flex flex-col gap-5">
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, label, description }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white">
                    {label}
                  </span>
                  <span className="text-sm text-white/60">{description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="flex items-center gap-2 text-xs text-white/50">
          <HiOutlineShieldCheck size={15} />
          Your data stays private. We never share it.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
