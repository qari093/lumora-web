export function breadcrumbs(path: string) {
  return path.split("/").filter(Boolean);
}
