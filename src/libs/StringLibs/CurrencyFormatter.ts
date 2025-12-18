import { createToken, singleton } from 'launchpad-dependency-injection';
import { container } from '../Core/DI.ts';

export interface CurrencyFormatter {
  format(number: number): string
}

@singleton()
export class CurrencyFormatterImpl implements CurrencyFormatter {
  format(number: number): string {
    return number.toString();
  }
}

export const currencyFormatterSI =
  createToken<CurrencyFormatter>('CurrencyFormatter');

container.register(currencyFormatterSI, CurrencyFormatterImpl);