import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@c/lib/shadcn/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

interface DestructiveAlertI {
  title?: string;
  description?: string | Record<string, string[]>;
}
export function DestructiveAlert({ title, description }: DestructiveAlertI) {
  return (
    <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <AlertTriangleIcon />
      <AlertTitle>{title ?? ""}</AlertTitle>
      <AlertDescription>
        {description &&
          (typeof description === "object"
            ? Object.values(description).map((value) => (
                <ul>
                  <li className="font-normal text-sm list-disc">{value}</li>
                </ul>
              ))
            : description)}
      </AlertDescription>
    </Alert>
  );
}
