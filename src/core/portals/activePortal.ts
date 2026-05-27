export function activePortal(pathname: string) {
  return pathname.split("/")[1] || "home";
}
