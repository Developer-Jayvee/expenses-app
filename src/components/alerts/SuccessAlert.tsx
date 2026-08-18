import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@c/lib/shadcn/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

interface SuccessAlertI {
  title?: string;
  description?: string;
}
export function SuccessAlert({ title, description }: SuccessAlertI) {
  return (
    <Alert className="max-w-md border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50">
      <CheckCircle2Icon />
      <AlertTitle>{title ?? ""}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
