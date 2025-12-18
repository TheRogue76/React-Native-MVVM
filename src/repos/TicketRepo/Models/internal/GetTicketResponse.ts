// Zod schema for API response
import { z } from 'zod';

export const GetTicketResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

// Zod schema for list of tickets from API
export const GetTicketListResponseSchema = z.array(GetTicketResponseSchema);

export type GetTicketResponse = z.infer<typeof GetTicketResponseSchema>;
