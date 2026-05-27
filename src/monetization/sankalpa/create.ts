import { Sankalpa } from "./model";

export function createSankalpa(input: {
  userId: string;
  statement: string;
  now: number;
}): Sankalpa {
  return {
    userId: input.userId,
    statement: input.statement.trim(),
    createdAt: input.now,
  };
}
