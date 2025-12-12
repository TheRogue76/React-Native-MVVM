import { mock } from 'jest-mock-extended';
import { CurrencyFormatter } from '../../src/libs/StringLibs/CurrencyFormatter.ts';
import { OrderRepoImpl } from '../../src/repos/OrderRepo/OrderRepo.ts';

describe('OrderRepo tests', () => {
  let formatter = mock<CurrencyFormatter>();

  function createOrderRepo() {
    return new OrderRepoImpl(formatter);
  }

  test('See if testing works', () => {
    // Given
    const orderRepo = createOrderRepo();
    formatter.format.mockImplementation(input => `${input}`);
    // When
    const result = orderRepo.latestOrder();
    // Then
    expect(result).toBe('1234');
    expect(formatter.format).toHaveBeenCalledTimes(1);
  });
});
