import { createToken, get, transient } from 'launchpad-dependency-injection';
import { type TicketRepo, ticketRepoSI } from '../../repos/TicketRepo';
import { type Navigation, navigationSI } from '../../Navigation.tsx';
import { makeAutoObservable } from 'mobx';
import { container } from '../../libs/Core/DI.ts';

type State = Loading | Error | Loaded;
type Loading = { type: 'loading' };
type Error = { type: 'error' };
type Loaded = { type: 'loaded'; data: { counter: string } };
export type { Loading, Error, Loaded };

@transient()
export class HomeScreenViewModel {
  state: State = { type: 'loading' };
  private counter = 0;
  private readonly ticketRepo: TicketRepo;
  private readonly navigation: Navigation;
  constructor(ticketRepo?: TicketRepo, navigation?: Navigation) {
    this.ticketRepo = ticketRepo ?? get(ticketRepoSI);
    this.navigation = navigation ?? get(navigationSI);
    makeAutoObservable(this);
  }

  onAppear() {
    this.state = {
      type: 'loaded',
      data: { counter: (++this.counter).toString() },
    };
  }

  onButtonPressed() {
    this.navigation.navigate('Details', {id: '123'})
  }
}

export const homeViewModelSI = createToken<HomeScreenViewModel>(
  'HomeScreenViewModel',
);
container.register(homeViewModelSI, HomeScreenViewModel);