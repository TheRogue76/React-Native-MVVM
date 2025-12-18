import { mock } from 'jest-mock-extended';
import { Navigation } from '../../../src/Navigation.tsx';
import {
  InitializationScreenViewModel
} from '../../../src/views/InitializationScreen/InitializationScreenViewModel.ts';

describe('InitializationScreenViewModel', () => {
  const navigation = mock<Navigation>()

  function createInitializationViewModel() {
    return new InitializationScreenViewModel(navigation);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('onAppear we reset the navigation after 1 second', async () => {
    // Given
    navigation.reset.mockImplementation((input) => {
      expect(input).toEqual({index: 0, routes: [{name: 'TabbedNavigator'}]});
    })
    const viewModel = createInitializationViewModel();
    // When
    viewModel.onAppear()
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Then
    expect(navigation.reset).toHaveBeenCalledTimes(1)
  })
})