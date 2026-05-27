export interface CreatorProfileRuntime {
  id: string;
  slug: string;
  bio?: string;
}

export function createCreatorProfile(input: CreatorProfileRuntime) {
  return input;
}
