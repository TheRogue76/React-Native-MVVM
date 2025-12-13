import { mock } from 'jest-mock-extended';
import { CurrencyFormatter } from '../../../src/libs/StringLibs';
import { TicketRepoImpl } from '../../../src/repos/TicketRepo/TicketRepo.ts';

describe('TicketRepo tests', () => {
  const formatter = mock<CurrencyFormatter>();

  function createOrderRepo() {
    return new TicketRepoImpl(formatter);
  }

  test('See if testing works', () => {
    // Given
    const orderRepo = createOrderRepo();
    formatter.format.mockImplementation(input => `${input}`);
    // When
    const result = orderRepo.latestItem();
    // Then
    expect(result).toBe('1234');
    expect(formatter.format).toHaveBeenCalledTimes(1);
  });
});
