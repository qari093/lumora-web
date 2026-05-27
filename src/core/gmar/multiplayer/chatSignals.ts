export function chatSignal(message: string) {
  return {
    valid: message.length > 0
  };
}
