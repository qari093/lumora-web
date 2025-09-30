import { z } from "zod";
export const CreateLinkBody = z.object({ userId: z.string().min(1) });
export const AcceptLinkBody = z.object({ code: z.string().min(1), inviteeId: z.string().min(1) });
