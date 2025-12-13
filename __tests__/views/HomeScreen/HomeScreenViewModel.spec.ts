import { mock } from 'jest-mock-extended';
import { TicketRepo } from '../../../src/repos/TicketRepo';
import { Navigation } from '../../../src/Navigation.tsx';
import { HomeScreenViewModel } from '../../../src/views/HomeScreen/HomeScreenViewModel.ts';

describe('HomeScreenViewModel', () => {
  const ticketRepo = mock<TicketRepo>()
  const navigation = mock<Navigation>()

  function createHomeScreenViewModel() {
    return new HomeScreenViewModel(ticketRepo, navigation);
  }
  test('onAppear we call latest item', () => {
    // Given
    const viewModel = createHomeScreenViewModel();
    ticketRepo.latestItem.mockImplementation(() => '123')
    // When
    viewModel.onAppear()
    // Then
    expect(ticketRepo.latestItem).toHaveBeenCalledTimes(1)
  })

  test('onButtonPress we navigate to details', () => {
    // Given
    const viewModel = createHomeScreenViewModel();
    navigation.navigateToDetails.mockImplementation(() => {})
    // When
    viewModel.onButtonPressed()
    // Then
    expect(navigation.navigateToDetails).toHaveBeenCalledTimes(1)
  })
})