import { mock } from 'jest-mock-extended';
import { NetworkClient } from '../../../../src/libs/NetworkingLib';
import {
  TicketRemoteDataSourceImpl,
} from '../../../../src/repos/TicketRepo/datasource/TicketRemoteDataSource';
import {
  GetTicketListResponseSchema,
  GetTicketResponse,
} from '../../../../src/repos/TicketRepo/Models/internal/GetTicketResponse';

describe('TicketRemoteDataSource tests', () => {
  const networkClient = mock<NetworkClient>()

  function createTicketRemoteDataSourceImpl() {
    return new TicketRemoteDataSourceImpl(networkClient);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('fetchTickets should return data when network request succeeds', async () => {
    const remoteDataSource = createTicketRemoteDataSourceImpl()
    const mockApiResponse: GetTicketResponse[] = [
      { id: 1, userId: 100, title: 'Fix bug', completed: false },
      { id: 2, userId: 101, title: 'Add feature', completed: true },
      { id: 3, userId: 102, title: 'Write docs', completed: false },
    ];
    networkClient.request.mockResolvedValue(mockApiResponse);

    // When
    const result = await remoteDataSource.fetchTickets();

    // Then
    expect(result).toEqual(mockApiResponse);
    expect(networkClient.request).toHaveBeenCalledTimes(1);
    expect(networkClient.request).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/todos',
      'GET',
      GetTicketListResponseSchema,
    );
  });

  test('fetchTickets should throw error when network request fails or parsing fails', async () => {
    const remoteDataSource = createTicketRemoteDataSourceImpl();
    const mockError = new Error('Network connection failed');
    networkClient.request.mockRejectedValue(mockError);

    // When/Then
    await expect(remoteDataSource.fetchTickets()).rejects.toThrow(
      'Network connection failed',
    );
    expect(networkClient.request).toHaveBeenCalledTimes(1);
  });
});
