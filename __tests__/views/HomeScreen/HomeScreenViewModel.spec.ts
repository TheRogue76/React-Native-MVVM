import { mock } from 'jest-mock-extended';
import { TicketRepo } from '../../../src/repos/TicketRepo';
import { Navigation } from '../../../src/Navigation.tsx';
import {
  HomeScreenViewModel,
  Loaded,
} from '../../../src/views/HomeScreen/HomeScreenViewModel.ts';

describe('HomeScreenViewModel', () => {
  const ticketRepo = mock<TicketRepo>()
  const navigation = mock<Navigation>()

  function createHomeScreenViewModel() {
    return new HomeScreenViewModel(ticketRepo, navigation);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('when the viewModel is created it starts with a loading screen', () => {
    // Given
    const viewModel = createHomeScreenViewModel();
    expect(viewModel.state.type).toBe('loading')
  })

  test('onAppear we update the counter', () => {
    // Given
    const viewModel = createHomeScreenViewModel();
    // When
    viewModel.onAppear()
    // Then
    expect(viewModel.state.type).toBe('loaded')
    expect((viewModel.state as Loaded).data.counter).toBe("1")
  })

  test('onButtonPress we navigate to details', () => {
    // Given
    const viewModel = createHomeScreenViewModel();
    navigation.navigate.mockImplementation(() => {})
    // When
    viewModel.onButtonPressed();
    // Then
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  })
})