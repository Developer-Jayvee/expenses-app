import { BsThreeDots } from "react-icons/bs";
import DropMenu from "@c/components/ui/DropMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@c/lib/shadcn/components/ui/table";
import { Badge } from "@c/lib/shadcn/components/ui/badge";
import type { PostBillDataI } from "@c/types/billsTypes";
import {
  avatar_tint,
  bill_status_pill_class,
  currency_formatter,
  date_formatter,
  get_initials,
} from "@c/utils/utilities.util";

interface BillsDataTableI {
  bills: Array<PostBillDataI>;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BillsDataTable({
  bills,
  onOpen,
  onDelete,
}: BillsDataTableI) {
  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-16 text-center">
        <span className="text-sm font-semibold">No bills found</span>
        <span className="text-sm text-muted-foreground">
          Try a different search or filter.
        </span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Biller</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Monthly Deadline</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => {
          const tint = avatar_tint(bill.name);
          const isCompleted = bill.status === "completed";
          return (
            <TableRow
              key={bill.id}
              className="cursor-pointer"
              onClick={() => onOpen(bill.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${tint.bg} ${tint.fg}`}
                  >
                    {get_initials(bill.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {bill.name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground capitalize">
                      {bill.category?.replace(/_/g, " ") || "Uncategorized"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-sm font-semibold">
                {currency_formatter(bill.amount)}
              </TableCell>
              <TableCell>
                <Badge className={bill_status_pill_class(bill.status)}>
                  <span className="size-1.5 rounded-full bg-current" />
                  {bill.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Day {new Date(bill.billing_date).getDate()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {date_formatter(bill.end_date as unknown as Date)}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropMenu
                  options={[
                    {
                      items: [
                        { label: "Open", event: () => onOpen(bill.id) },
                        ...(isCompleted
                          ? []
                          : [
                              {
                                label: "Delete",
                                event: () => onDelete(bill.id),
                              },
                            ]),
                      ],
                    },
                  ]}
                >
                  <BsThreeDots className="text-muted-foreground" />
                </DropMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
