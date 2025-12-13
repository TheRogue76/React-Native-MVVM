import { container } from '../../libs/Core/DI.ts';
import { TicketRepo, TicketRepoImpl } from './TicketRepo.ts';
import { ServiceIdentifier } from '@inversifyjs/common';

export const ticketRepoSI: ServiceIdentifier<TicketRepo> = Symbol.for('ticketRepo')

container.bind<TicketRepo>(ticketRepoSI).to(TicketRepoImpl).inSingletonScope()