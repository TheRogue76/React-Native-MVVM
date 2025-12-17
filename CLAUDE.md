# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Launchpad is an opinionated template for building testable, scalable React Native applications using an MVVM architecture with dependency injection. The template uses React Native 0.83.0, Inversify for DI, MobX for reactivity, and React Navigation for routing.

## Core Architecture Principles

The codebase follows a strict layered architecture with **no horizontal dependencies**:

1. **Libs** (`src/libs/`): Atomic utilities (currency formatters, analytics, network interceptors). Libs cannot depend on other libs.
2. **Repos** (`src/repos/`): Domain logic layer handling business rules, data fetching, and caching. Repos cannot depend on other repos.
3. **Views** (`src/views/`): UI components with ViewModels managing screen state. ViewModels cannot depend on other ViewModels.

**Critical Rule**: Dependencies flow downward only (Views → Repos → Libs). Cross-layer communication uses the Inversify container for service discovery.

## Dependency Injection Pattern

All modules use Inversify for dependency injection:

### Module Registration Pattern

Each module has a `module.ts` file that registers itself with the container:

```typescript
// For interfaces (Repos and Libs)
import { container } from '../../libs/Core/DI.ts';
import { ServiceIdentifier } from '@inversifyjs/common';

export const ticketRepoSI: ServiceIdentifier<TicketRepo> = Symbol.for('ticketRepo')
container.bind<TicketRepo>(ticketRepoSI).to(TicketRepoImpl).inSingletonScope()

// For ViewModels (transient - new instance per use)
container.bind(HomeScreenViewModel).toSelf().inTransientScope()
```

### Dependency Injection in Classes

Use `@injectable()` decorator and `@inject()` for dependencies:

```typescript
import { inject, injectable } from '@inversifyjs/core';

@injectable()
export class HomeScreenViewModel {
  constructor(
    @inject(ticketRepoSI) private readonly ticketRepo: TicketRepo,
    @inject(navigationSI) private readonly navigation: Navigation,
  ) {
    makeAutoObservable(this);
  }
}
```

**Important**: Always import `reflect-metadata` at the top of entry files for decorators to work.

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

### Unit Tests
- Tests live in `__tests__/` directory mirroring source structure
- Use `jest-mock-extended` for creating mocks: `mock<Interface>()`
- Follow Given-When-Then pattern
- Manually inject mocked dependencies into constructors (bypass DI container)

Example:
```typescript
import { mock } from 'jest-mock-extended';

const formatter = mock<CurrencyFormatter>();
const ticketRepo = new TicketRepoImpl(formatter);
formatter.format.mockImplementation(input => `${input}`);
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

- `src/libs/Core/DI.ts` - Inversify container instance
- `src/App.tsx` - Entry point with MobX configuration
- `setup-jest.js` - Global Jest configuration and native module mocks
- `.detoxrc.js` - Detox E2E test configuration
- `babel.config.js` - Includes decorators plugin for DI

## Important Notes

- Node.js >= 20 required
- Always create `module.ts` files to register new Repos/Libs/ViewModels with the DI container
- Repos and Libs are singletons; ViewModels are transient
- Import module files to ensure registration happens before container.get() calls
- Avoid writing logic in React hooks; use ViewModels and Repos instead
