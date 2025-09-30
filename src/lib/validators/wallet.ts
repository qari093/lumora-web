import { z } from "zod";
export const EarnBody = z.object({ userId: z.string().min(1), amount: z.number().int().positive(), source: z.string().min(1) });
export const TransferBody = z.object({ from: z.string().min(1), to: z.string().min(1), amount: z.number().int().positive(), memo: z.string().optional() });
