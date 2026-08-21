import { useSyncExternalStore } from "react";
import ServerStatusService from "@c/services/ServerStatusService";

export default function useServerStatusHook() {
  const isServerDown = useSyncExternalStore(
    ServerStatusService.subscribe,
    ServerStatusService.getSnapshot,
  );

  return {
    isServerDown,
    message: ServerStatusService.getMessage(),
  };
}
