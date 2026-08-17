import { Button } from "@c/lib/shadcn/components/ui/button";
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
          <TableHead className="w-25 text-center">Date</TableHead>
          <TableHead className="w-37.5 text-center">Amount</TableHead>
          <TableHead className="w-25 text-center">Method</TableHead>
          <TableHead className="text-center w-35 ">Status</TableHead>
          <TableHead className="text-center">Reference</TableHead>
          <TableHead className="text-center">Actions</TableHead>
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
                <TableCell className="font-medium text-center">
                  {data?.transaction_date}
                </TableCell>
                <TableCell className=" text-center">
                  Php {data?.amount}
                </TableCell>
                <TableCell className="text-center">
                  {data?.payment_mode?.label}
                </TableCell>
                <TableCell className="text-center">PAID</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center">
                  {onDelete && canDelete && (
                    <Button
                      type="button"
                      variant="destructive"
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
