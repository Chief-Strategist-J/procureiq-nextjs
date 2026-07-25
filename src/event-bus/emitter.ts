export function emitEvent<T>(eventName: string, payload: T): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<T>(eventName, { detail: payload });
    window.dispatchEvent(event);
  }
}
