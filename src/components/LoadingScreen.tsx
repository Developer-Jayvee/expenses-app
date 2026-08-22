import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Loading your workspace...",
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
      <div className="flex items-center gap-2.5">
        <div className="profile-icon-bg flex size-8 items-center justify-center rounded-lg font-bold text-white">
          $
        </div>
        <span className="text-lg font-bold tracking-tight">Coinpath</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Loader2 size={22} className="animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
