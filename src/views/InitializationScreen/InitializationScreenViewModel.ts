import { transient, get, createToken } from 'launchpad-dependency-injection';
import { type Navigation, navigationSI } from '../../Navigation.tsx';
import { makeAutoObservable } from 'mobx';
import { container } from '../../libs/Core/DI.ts';

@transient()
export class InitializationScreenViewModel {
  private readonly navigation: Navigation;
  constructor(navigation?: Navigation) {
    this.navigation = navigation ?? get(navigationSI);
    makeAutoObservable(this);
  }

  onAppear() {
    // Inside here we can call the initialization logic needed to get things up and running,
    // and once ready, decide where to navigate
    // For this example it just wastes a second
    setTimeout(() => {
      this.navigation.reset({index: 0, routes: [{name: 'TabbedNavigator'}]});
    }, 1000);
  }
}

export const initializationViewModelSI =
  createToken<InitializationScreenViewModel>('InitializationScreenViewModel');

container.register(initializationViewModelSI, InitializationScreenViewModel);