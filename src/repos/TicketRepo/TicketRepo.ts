import { type CurrencyFormatter, currencyFormatterSI } from '../../libs/StringLibs';
import { injectable, inject } from '@inversifyjs/core';

export interface TicketRepo {
  latestItem(): string;
}

@injectable()
export class TicketRepoImpl implements TicketRepo {
  constructor(
    @inject(currencyFormatterSI)
    private readonly currencyFormatter: CurrencyFormatter,
  ) {}
  latestItem(): string {
    return this.currencyFormatter.format(1234);
  }
}