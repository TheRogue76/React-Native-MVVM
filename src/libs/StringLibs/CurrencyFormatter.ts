export interface CurrencyFormatter {
  format(number: number): string
}

export class CurrencyFormatterImpl implements CurrencyFormatter {
  format(number: number): string {
    return number.toString();
  }
}