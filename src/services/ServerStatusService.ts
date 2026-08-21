type Listener = () => void;

const DEFAULT_MESSAGE =
  "We can't reach the server right now. Some features may not work until the connection is restored.";

let isDown = false;
let message = DEFAULT_MESSAGE;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

export default class ServerStatusService {
  static subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  static getSnapshot(): boolean {
    return isDown;
  }

  static getMessage(): string {
    return message;
  }

  static reportDown(customMessage?: string): void {
    message = customMessage ?? DEFAULT_MESSAGE;
    if (isDown) return;
    isDown = true;
    emit();
  }

  static reportUp(): void {
    if (!isDown) return;
    isDown = false;
    emit();
  }
}
