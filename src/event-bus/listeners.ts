export function listenEvent<T>(eventName: string, callback: (payload: T) => void): () => void {
  if (typeof window !== 'undefined') {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<T>;
      callback(customEvent.detail);
    };
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }
  return () => {};
}
