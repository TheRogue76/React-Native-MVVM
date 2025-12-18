import { mock } from 'jest-mock-extended';
import { CurrencyFormatter } from '../../../src/libs/StringLibs';
import { TicketRepoImpl } from '../../../src/repos/TicketRepo/TicketRepo.ts';
import { TicketRemoteDataSource } from '../../../src/repos/TicketRepo/datasource/TicketRemoteDataSource.ts';
import { GetTicketResponse } from '../../../src/repos/TicketRepo/Models/internal/GetTicketResponse.ts';

describe('TicketRepo tests', () => {
  const formatter = mock<CurrencyFormatter>();
  const remoteDataSource = mock<TicketRemoteDataSource>();

  function createTicketRepo() {
    return new TicketRepoImpl(formatter, remoteDataSource);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('See if testing works', () => {
    // Given
    const ticketRepo = createTicketRepo();
    formatter.format.mockImplementation(input => `${input}`);
    // When
    const result = ticketRepo.latestItem();
    // Then
    expect(result).toBe('1234');
    expect(formatter.format).toHaveBeenCalledTimes(1);
  });

  test('fetchTickets should map API response to domain models on success', async () => {
    // Given
    const ticketRepo = createTicketRepo();
    const mockApiResponse: GetTicketResponse[] = [
      { id: 1, userId: 100, title: 'Fix bug', completed: false },
      { id: 2, userId: 101, title: 'Add feature', completed: true },
    ];
    remoteDataSource.fetchTickets.mockResolvedValue(mockApiResponse);

    // When
    const result = await ticketRepo.fetchTickets();

    // Then
    expect(result).toEqual([
      { id: '1', title: 'Fix bug', isCompleted: false },
      { id: '2', title: 'Add feature', isCompleted: true },
    ]);
    expect(remoteDataSource.fetchTickets).toHaveBeenCalledTimes(1);
  });

  test('fetchTickets should throw error when remote data source fails', async () => {
    // Given
    const ticketRepo = createTicketRepo();
    const mockError = new Error('Network error');
    remoteDataSource.fetchTickets.mockRejectedValue(mockError);

    // When/Then
    await expect(ticketRepo.fetchTickets()).rejects.toThrow('Network error');
    expect(remoteDataSource.fetchTickets).toHaveBeenCalledTimes(1);
  });
});
