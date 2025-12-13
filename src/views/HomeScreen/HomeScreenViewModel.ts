import { inject, injectable } from '@inversifyjs/core';
import { type TicketRepo, ticketRepoSI } from '../../repos/TicketRepo';
import { type Navigation, navigationSI } from '../../Navigation.tsx';

@injectable()
export class HomeScreenViewModel {
  constructor(
    @inject(ticketRepoSI)
    private readonly orderRepo: TicketRepo,
    @inject(navigationSI)
    private readonly navigation: Navigation,
  ) {}

  onAppear() {
    console.log(this.orderRepo.latestItem());
  }

  onButtonPressed() {
    this.navigation.navigateToDetails()
  }
}