export function memoryValidator(usedMb: number) {
  return {
    valid: usedMb <= 512,
    usedMb
  };
}
