import { inject, injectable } from '@inversifyjs/core';
import { type Navigation, navigationSI } from '../../Navigation.tsx';
import { makeAutoObservable } from 'mobx';

@injectable()
export class InitializationScreenViewModel {
  constructor(
    @inject(navigationSI)
    private readonly navigation: Navigation
  ) {
    makeAutoObservable(this)
  }

  onAppear() {
    // Inside here we can call the initialization logic needed to get things up and running,
    // and once ready, decide where to navigate
    // For this example it just wastes a second
    setTimeout(() => {
      this.navigation.navigate('TabbedNavigator');
    }, 1000);
  }
}