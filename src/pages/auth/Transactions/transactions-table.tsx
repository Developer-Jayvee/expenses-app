import { Button } from "@c/lib/shadcn/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@c/lib/shadcn/components/ui/table";
import type { TransactionsTableI } from "@c/types/transactionTypes";
import { CiTrash } from "react-icons/ci";

export default function TransactionTable({
  list,
  onDelete,
}: TransactionsTableI) {
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
          list.map((data) => (
            <TableRow key={data.id}>
              <TableCell className="font-medium text-center">
                {data?.transaction_date}
              </TableCell>
              <TableCell className=" text-center">Php {data?.amount}</TableCell>
              <TableCell className="text-center">
                {data?.payment_mode?.label}
              </TableCell>
              <TableCell className="text-center">PAID</TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center">
                {onDelete && (
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
          ))}
      </TableBody>
    </Table>
  );
}
