import { Button } from "@c/lib/shadcn/components/ui/button";
import { Badge } from "@c/lib/shadcn/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@c/lib/shadcn/components/ui/table";
import {
  TRANSACTION_DELETE_WINDOW_MS,
  type TransactionsTableI,
} from "@c/types/transactionTypes";
import { currency_formatter } from "@c/utils/utilities.util";
import { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";

export default function TransactionTable({
  list,
  onDelete,
  pendingDeleteIds,
}: TransactionsTableI) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {list &&
          list.map((data) => {
            const isPendingDelete = pendingDeleteIds?.has(data.id) ?? false;
            const isFresh =
              now - new Date(data.created_at).getTime() <=
              TRANSACTION_DELETE_WINDOW_MS;
            const canDelete = isFresh && !isPendingDelete;
            return (
              <TableRow
                key={data.id}
                className={isPendingDelete ? "opacity-50" : undefined}
              >
                <TableCell className="font-mono text-muted-foreground">
                  {data?.transaction_date}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {currency_formatter(data?.amount)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {data?.payment_mode?.label}
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-current" />
                    Paid
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  —
                </TableCell>
                <TableCell className="text-right">
                  {onDelete && canDelete && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      title="Delete payment log"
                      onClick={() => onDelete(data)}
                    >
                      <CiTrash size={16} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
