import { inject, injectable } from '@inversifyjs/core';
import { type TicketRepo, ticketRepoSI } from '../../repos/TicketRepo';
import { type Navigation, navigationSI } from '../../Navigation.tsx';
import { makeAutoObservable } from 'mobx';

type State = Loading | Error | Loaded;
type Loading = { type: 'loading' };
type Error = { type: 'error' };
type Loaded = { type: 'loaded'; data: { counter: string } };
export type { Loading, Error, Loaded };

@injectable()
export class HomeScreenViewModel {
  state: State = { type: 'loading' };
  private counter = 0;
  constructor(
    @inject(ticketRepoSI)
    private readonly ticketRepo: TicketRepo,
    @inject(navigationSI)
    private readonly navigation: Navigation,
  ) {
    makeAutoObservable(this);
  }

  onAppear() {
    this.state = {
      type: 'loaded',
      data: { counter: (++this.counter).toString() },
    };
  }

  onButtonPressed() {
    this.navigation.navigateToDetails()
  }
}