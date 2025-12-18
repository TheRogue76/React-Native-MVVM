# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Launchpad is an opinionated template for building testable, scalable React Native applications using an MVVM architecture with dependency injection. The template uses React Native 0.83.0, a custom lightweight DI system (`launchpad-dependency-injection`), MobX for reactivity, and React Navigation for routing.

## Core Architecture Principles

The codebase follows a strict layered architecture with **no horizontal dependencies**:

1. **Libs** (`src/libs/`): Atomic utilities (currency formatters, analytics, network interceptors). Libs cannot depend on other libs.
2. **Repos** (`src/repos/`): Domain logic layer handling business rules, data fetching, and caching. Repos cannot depend on other repos.
3. **Views** (`src/views/`): UI components with ViewModels managing screen state. ViewModels cannot depend on other ViewModels.

**Critical Rule**: Dependencies flow downward only (Views → Repos → Libs). Cross-layer communication uses the DI container for service discovery.

## Dependency Injection Pattern

The template uses a lightweight custom DI system (`launchpad-dependency-injection`). All registration happens directly in the implementation file.

### Registration Pattern

Each class registers itself with the container at the bottom of its file:

```typescript
import { createToken, singleton } from 'launchpad-dependency-injection';
import { container } from '../../libs/Core/DI.ts';

export interface TicketRepo {
  fetchTickets(): Promise<Ticket[]>;
}

@singleton()
export class TicketRepoImpl implements TicketRepo {
  private currencyFormatter: CurrencyFormatter;

  constructor(currencyFormatter?: CurrencyFormatter) {
    this.currencyFormatter = currencyFormatter ?? get(currencyFormatterSI);
  }

  async fetchTickets(): Promise<Ticket[]> {
    // implementation
  }
}

// Create token and register - all in the same file
export const ticketRepoSI = createToken<TicketRepo>('ticketRepo');
container.register(ticketRepoSI, TicketRepoImpl);
```

### Dependency Injection in Classes

Use `@singleton()` decorator and optional constructor parameters with fallback to `get()`:

```typescript
import { singleton, get } from 'launchpad-dependency-injection';

@singleton()
export class HomeScreenViewModel {
  private ticketRepo: TicketRepo;
  private navigation: Navigation;

  constructor(ticketRepo?: TicketRepo, navigation?: Navigation) {
    this.ticketRepo = ticketRepo ?? get(ticketRepoSI);
    this.navigation = navigation ?? get(navigationSI);
    makeAutoObservable(this);
  }
}
```

**Key Points**:
- Optional constructor parameters enable easy testing (pass mocks directly)
- Fallback to `get(token)` for production DI container resolution
- `@singleton()` ensures single instance across the app
- Token creation and registration happen in the same file as the implementation

## ViewModel Pattern

ViewModels use MobX for reactive state management:

- Use `makeAutoObservable(this)` in constructor to make state observable
- Define state as discriminated unions with a `type` field
- Components use `observer()` HOC to react to state changes
- Fetch ViewModels from container in components: `container.get(HomeScreenViewModel, { autobind: true })`

Example state pattern:
```typescript
type State = Loading | Error | Loaded;
type Loading = { type: 'loading' };
type Error = { type: 'error' };
type Loaded = { type: 'loaded'; data: { counter: string } };
```

## MobX Configuration

MobX is configured in strict mode (`src/App.tsx:3-10`) to enforce best practices:
- `enforceActions: 'always'` - All state modifications must be in actions
- `computedRequiresReaction: true`
- `reactionRequiresObservable: true`
- `observableRequiresReaction: true`

## Networking and Data Fetching

### Network Layer (`src/libs/NetworkingLib/`)

The template includes a type-safe networking client with interceptor support:

- **NetworkClient**: Generic fetch wrapper with Zod schema validation
- **Request/Response Interceptors**: Add headers, logging, auth tokens, etc.
- **Type Safety**: All responses validated against Zod schemas at runtime

Example usage:
```typescript
await networkClient.request(
  'https://api.example.com/data',
  'GET',
  MyDataSchema, // Zod schema
  { headers: { 'Authorization': 'Bearer token' } }
);
```

### Remote Data Sources Pattern

Each repo can have one or more **RemoteDataSource** classes for API communication:

**Structure**:
- `RemoteDataSource` is **internal** to the repo (not exported)
- Define Zod schemas for API responses (e.g., `GetTicketResponseSchema`)
- Inject `NetworkClient` into the data source
- Data sources are registered as singletons in the DI container

**Example**: `TicketRemoteDataSource` (`src/repos/TicketRepo/datasource/`)
```typescript
@singleton()
export class TicketRemoteDataSourceImpl implements TicketRemoteDataSource {
  private networkClient: NetworkClient;

  constructor(networkClient?: NetworkClient) {
    this.networkClient = networkClient ?? get(networkClientSI);
  }

  async fetchTickets(): Promise<GetTicketResponse[]> {
    return this.networkClient.request(
      `${this.baseUrl}/tickets`,
      'GET',
      GetTicketListResponseSchema,
    );
  }
}

export const ticketRemoteDataSourceSI = createToken<TicketRemoteDataSource>('TicketRemoteDataSource');
container.register(ticketRemoteDataSourceSI, TicketRemoteDataSourceImpl);
```

### Domain Models and Mappers

**Critical Pattern**: Separate API response types from domain models.

**Structure**:
- API responses: `GetXResponse` types (from RemoteDataSource)
- Domain models: `X` types in `Models/` folder
- Mapper functions: Convert API → Domain in `Models/X.ts`
- Only domain models are exported from repos

**Example**: `src/repos/TicketRepo/Models/Ticket.ts`
```typescript
export interface Ticket {
  id: string;        // Converted from number
  title: string;
  isCompleted: boolean;  // Renamed from 'completed'
}

export function mapTicketResponseToTicket(response: GetTicketResponse): Ticket {
  return {
    id: response.id.toString(),
    title: response.title,
    isCompleted: response.completed,
  };
}
```

**In the Repo**:
```typescript
async fetchTickets(): Promise<Ticket[]> {
  const apiResponse = await this.ticketRemoteDataSource.fetchTickets();
  return apiResponse.map(mapTicketResponseToTicket);
}
```

**Why this matters**: API structures change, but domain models stay stable. Repos handle the translation layer.

## Native Modules & Views with Nitro

This project uses `react-native-nitro-modules` for native code:

1. Define TypeScript interfaces in `native-modules/src/` or `native-views/src/`
2. Run `npx nitrogen` in the respective directory to generate Kotlin/Swift interfaces
3. Implement native code in the generated files

**Testing Requirement**: All native modules/views must be mocked in Jest. Add mocks to `setup-jest.js` or locally in test files.

## Common Commands

### Development
```bash
yarn start              # Start Metro bundler
yarn ios                # Run on iOS simulator
yarn android            # Run on Android emulator
yarn ios:pods           # Install iOS CocoaPods dependencies
```

### Testing
```bash
# Unit tests (Jest)
yarn test:unit

# E2E tests (Detox)
yarn test:e2e:build:ios     # Build iOS test app
yarn test:e2e:run:ios       # Run iOS E2E tests (requires Metro running)
yarn test:e2e:build:android # Build Android test app
yarn test:e2e:run:android   # Run Android E2E tests (requires Metro running)
```

### Code Quality
```bash
yarn lint               # Run ESLint
```

## Testing Patterns

### Test Coverage Requirements

**Test coverage is very important** for this codebase:

- **Repos**: Must have comprehensive unit tests. Every public method should have tests for success and error cases.
- **ViewModels**: Must have unit tests covering all state transitions and user interactions.
- **Libs**: Try your best to test them. If a lib is too difficult to test (e.g., complex native integrations), some leeway is acceptable, but document why.

All repos and viewmodels should be thoroughly tested to ensure reliability.

### Unit Tests

- Tests live in `__tests__/` directory mirroring source structure
- Use `jest-mock-extended` for creating mocks: `mock<Interface>()`
- Follow Given-When-Then pattern
- Pass mocked dependencies directly to constructors (optional parameters make this easy)

Example:
```typescript
import { mock } from 'jest-mock-extended';

describe('TicketRepo tests', () => {
  test('fetchTickets should map API response to domain models on success', async () => {
    // Given
    const formatter = mock<CurrencyFormatter>();
    const remoteDataSource = mock<TicketRemoteDataSource>();
    const ticketRepo = new TicketRepoImpl(formatter, remoteDataSource);
    const mockApiResponse = [
      { id: 1, userId: 100, title: 'Fix bug', completed: false },
    ];
    remoteDataSource.fetchTickets.mockResolvedValue(mockApiResponse);

    // When
    const result = await ticketRepo.fetchTickets();

    // Then
    expect(result).toEqual([
      { id: '1', title: 'Fix bug', isCompleted: false },
    ]);
  });

  test('fetchTickets should throw error when remote data source fails', async () => {
    // Given
    const formatter = mock<CurrencyFormatter>();
    const remoteDataSource = mock<TicketRemoteDataSource>();
    const ticketRepo = new TicketRepoImpl(formatter, remoteDataSource);
    remoteDataSource.fetchTickets.mockRejectedValue(new Error('Network error'));

    // When/Then
    await expect(ticketRepo.fetchTickets()).rejects.toThrow('Network error');
  });
});
```

### E2E Tests

- Detox configuration in `.detoxrc.js`
- Tests in `e2e/` directory
- Must build app before running tests
- Metro must be running when executing E2E tests

## Project Setup

After cloning, run the rename script to customize the template:
```bash
./scripts/rename_template.sh
```

Then install iOS dependencies:
```bash
bundle install          # First time only, to install CocoaPods
yarn ios:pods          # Install pod dependencies
```

## Key Files

- `src/libs/Core/DI.ts` - DI container instance
- `src/App.tsx` - Entry point with MobX configuration
- `setup-jest.js` - Global Jest configuration and native module mocks
- `.detoxrc.js` - Detox E2E test configuration
- `babel.config.js` - Includes decorators plugin for DI

## Important Notes

- Node.js >= 20 required
- All DI registration happens at the bottom of implementation files (no separate `module.ts` files)
- Use `@singleton()` decorator for Repos and Libs (shared domain logic)
- ViewModels should be transient (new instance per use)
- Constructor parameters should be optional with `??` fallback to `get(token)` for DI resolution
- This pattern enables easy testing (pass mocks) and production DI (uses container)
- Avoid writing logic in React hooks; use ViewModels and Repos instead
