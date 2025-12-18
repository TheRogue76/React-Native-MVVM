import { type CurrencyFormatter, currencyFormatterSI } from '../../libs/StringLibs';
import { createToken, get, singleton } from 'launchpad-dependency-injection';
import {
  type TicketRemoteDataSource,
  ticketRemoteDataSourceSI,
} from './datasource/TicketRemoteDataSource.ts';
import { type Ticket, mapTicketResponseToTicket } from './Models/Ticket';
import { container } from '../../libs/Core/DI.ts';

export interface TicketRepo {
  latestItem(): string;
  fetchTickets(): Promise<Ticket[]>;
}

@singleton()
export class TicketRepoImpl implements TicketRepo {
  private readonly currencyFormatter: CurrencyFormatter;
  private readonly ticketRemoteDataSource: TicketRemoteDataSource;
  constructor(currencyFormatter?: CurrencyFormatter, ticketRemoteDataSource?: TicketRemoteDataSource) {
    this.currencyFormatter = currencyFormatter ?? get(currencyFormatterSI);
    this.ticketRemoteDataSource = ticketRemoteDataSource ?? get(ticketRemoteDataSourceSI);
  }

  latestItem(): string {
    return this.currencyFormatter.format(1234);
  }

  async fetchTickets(): Promise<Ticket[]> {
    const apiResponse = await this.ticketRemoteDataSource.fetchTickets();
    return apiResponse.map(mapTicketResponseToTicket);
  }
}
export const ticketRepoSI = createToken<TicketRepo>('ticketRepo');

container.register(ticketRepoSI, TicketRepoImpl);