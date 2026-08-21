import { ServerCrashIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@c/lib/shadcn/components/ui/alert";
import useServerStatusHook from "@c/hooks/useServerStatusHook";

export default function ServerStatusAlert() {
  const { isServerDown, message } = useServerStatusHook();

  if (!isServerDown) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex justify-center p-3">
      <Alert
        variant="destructive"
        className="w-full max-w-lg border-destructive/40 bg-background shadow-lg"
      >
        <ServerCrashIcon />
        <AlertTitle>Service unavailable</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
