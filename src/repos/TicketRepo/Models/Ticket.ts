import { type GetTicketResponse } from './internal/GetTicketResponse.ts';

export interface Ticket {
  id: string;
  title: string;
  isCompleted: boolean;
}

// Mapper function to convert API response to domain model
export function mapTicketResponseToTicket(response: GetTicketResponse): Ticket {
  return {
    id: response.id.toString(),
    title: response.title,
    isCompleted: response.completed,
  };
}
