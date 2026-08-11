import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@c/lib/shadcn/components/ui/table";

export default function TransactionTable() {
  return (
    <div className="w-full">
      <h3 className="font-bold px-3">Transactions</h3>
      <div>
        <div>{/* <input type="search" /> */}</div>
      </div>
      <div className="mt-4">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Date</TableHead>
              <TableHead className="w-37.5">Amount</TableHead>
              <TableHead className="w-25">Method</TableHead>
              <TableHead className="text-right w-35">Status</TableHead>
              <TableHead className="text-center">Reference</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
