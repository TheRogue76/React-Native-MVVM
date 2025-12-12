import { CurrencyFormatter, CurrencyFormatterImpl } from '../../libs/StringLibs/CurrencyFormatter.ts';

export interface OrderRepo {
  latestOrder(): string;
}

export class OrderRepoImpl implements OrderRepo {
  readonly formatter: CurrencyFormatter;
  constructor(private currencyFormatter: CurrencyFormatter) {
    this.formatter = currencyFormatter;
  }
  latestOrder(): string {
    return this.formatter.format(1234);
  }
}