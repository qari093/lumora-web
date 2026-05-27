export const maxUploadSizeMb = 500;

export function validateUpload(name: string) {
  return name.length > 0;
}
