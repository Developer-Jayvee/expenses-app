import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@c/lib/shadcn/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@c/lib/shadcn/components/ui/table";
import { Badge } from "@c/lib/shadcn/components/ui/badge";
import type { UpcomingBillI } from "@c/types/dashboardTypes";
import {
  bill_status_pill_class,
  currency_formatter,
  date_formatter,
} from "@c/utils/utilities.util";

interface UpcomingBillsTableI {
  bills: UpcomingBillI[];
}

export default function UpcomingBillsTable({ bills }: UpcomingBillsTableI) {
  const total = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills This Month</CardTitle>
        <CardDescription>
          {bills.length === 0
            ? "Nothing due this month."
            : `${bills.length} ${bills.length === 1 ? "bill" : "bills"} due · ${currency_formatter(total)} total`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <span className="text-sm font-semibold">All caught up</span>
            <span className="text-sm text-muted-foreground">
              No active bills are due this month.
            </span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Biller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="text-sm font-semibold">
                    {bill.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground capitalize">
                    {bill.category_label ?? "Uncategorized"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {date_formatter(bill.due_date as unknown as Date)}
                  </TableCell>
                  <TableCell>
                    <Badge className={bill_status_pill_class(bill.status)}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">
                    {currency_formatter(bill.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
