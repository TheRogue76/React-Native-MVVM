# Introduction

React Native Launchpad is an opinionated, batteries included template for building scalable testable apps.

The guiding principles for this template are as follows:
- Logic should be as easy to test as it is to develop
- React should empower the native, not try to abstract it away
- Avoid writing logic in hooks, write them in classes, use DI when necessary to provide access to that logic to the needed viewmodels.
- Avoid external third party dependencies that are not pure JS when reasonable. Write what you need in terms of native code instead so updates are painless

The general architecture of this template and how it is supposed to be used can be best described as follows:

- Libs: Atomic pieces of logic, say your currency formatter, your analytics implementation, your network interceptors, etc
- Repos: Domain logic. This is where the bulk of your app's logic exists. Each repo is in charge of a specific domain, like your user repo, your initialization repo, your in-app purchase repo, etc. Stuff like caching should be handled here
- Views: The UI logic for each screen, built from the data coming from the repos

![layers.png](https://raw.githubusercontent.com/TheRogue76/react-native-launchpad/refs/heads/main/layers.png)

*Important to note*: Layers can not have horizontal dependencies. Libs can not depend on each other, repos can not rely on each other, and view models can not rely on each other. Otherwise we will have cyclical dependencies

For communication between the different layers, we use a lightweight custom DI container (`launchpad-dependency-injection`) as a service discovery layer.

Each module registers itself with the container in the same file where it's implemented. Repos and Libs are singletons (shared across the app), while ViewModels are transient (new instance per use).

The registration pattern looks like this:
```typescript
@singleton()
export class TicketRepoImpl implements TicketRepo {
  constructor(dependency?: Dependency) {
    this.dependency = dependency ?? get(dependencySI);
  }
}

export const ticketRepoSI = createToken<TicketRepo>('ticketRepo');
container.register(ticketRepoSI, TicketRepoImpl);
```

This pattern makes testing easy - just pass mocks directly to constructors. In production, the DI container resolves dependencies automatically.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) and the [Detox setup prerequisites](https://wix.github.io/Detox/docs/introduction/environment-setup#detox-prerequisites) guide before proceeding.

## Step 1: Rename the Template Project

Before starting development, you should rename the template from "AwesomeProject" to your own project name.

Run the rename script from the root of your project:

```sh
./scripts/rename_template.sh
```

The script will prompt you for:
- **New project name** (required): The name for your project (e.g., `MyApp`)
- **iOS bundle identifier** (optional): Custom iOS bundle ID (e.g., `com.yourcompany.MyApp`)
- **Android bundle identifier** (optional): Custom Android package name (e.g., `com.yourcompany.myapp`)

If you don't provide custom bundle identifiers, the script will use sensible defaults based on your project name.

After running the script, remember to:
1. Install iOS CocoaPods dependencies: `yarn ios:pods`
2. Clean build folders if needed:
   - iOS: `cd ios && xcodebuild clean`
   - Android: `cd android && ./gradlew clean`
3. Delete the scripts folder as it is no longer needed

## Step 2: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
yarn ios:pods
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 4: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Step 5: Add native modules and views

Depending on if you want to add native views (Say Webview, Lottie) or native modules (Bluetooth, SQL) you can go inside the `native-views` or the `native-modules` directories and define your interface in TypeScript.

You can then run 
```shell
npx nitro
```
in that directory and it will generate the respective Kotlin and Swift interfaces, that you can then use to develop your logic

For more instructions on native module setup read:

- Views: https://nitro.margelo.com/docs/view-components
- Modules: https://nitro.margelo.com/docs/how-to-build-a-nitro-module

*IMPORTANT TO NOTE*: Any native module/view that you create, you will also need to create a mock for as well in jest.
You can do it locally per the tests that need your native module, or you can use the global ones provided under `setup-jest.js` if you don't care about their output

## Step 6: Running unit tests with Jest

This template is already setup with examples and all the necessary bits out of the box to have Unit testing working
Simply add your test under `__tests__` folder and run:
```shell
yarn test:unit
```
to validate them

## Step 7: Running e2e tests with detox

In order to run E2E tests, we first need to make one off builds. Both release and debug mode have been configured, however in the scripts we will only include cases for debug to not assume your release and archiving process
First, add your new test under `e2e` directory

Then, for iOS, first run:
```shell
yarn test:e2e:build:ios
```
to build the app, and with metro running (`yarn start`), you can now run the following command:
```shell
yarn test:e2e:run:ios
```
For android, the commands for building and running are:
```shell
yarn test:e2e:build:android
```
and
```shell
yarn test:e2e:run:android
```
respectively.

# Acknowledgements
This template is powered by tools that the community already uses, such as:
- [React native community CLI for the bare workflow](https://github.com/react-native-community/cli)
- [Launchpad Dependency Injection - lightweight DI system](https://github.com/TheRogue76/launchpad-dependency-injection)
- [MobX for view models reactivity](https://github.com/mobxjs/mobx)
- [React Navigation for the navigation and deep linking systems](https://github.com/react-navigation/react-navigation)
- [Nitro modules for native views and native modules](https://github.com/mrousavy/nitro)
- [Zod for runtime schema validation](https://github.com/colinhacks/zod)
- [Jest for unit testing](https://github.com/jestjs/jest)
- [Detox for E2E testing](https://github.com/wix/Detox)

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
