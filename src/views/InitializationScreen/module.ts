import { container } from '../../libs/Core/DI.ts';
import { InitializationScreenViewModel } from './InitializationScreenViewModel.ts';

container.bind(InitializationScreenViewModel).toSelf().inTransientScope()