# Introduction

React Native Launchpad is an opinionated, batteries included template for building scalable testable apps
The guiding principals for this template are as follows:
- Logic should be as easy to test as it is to develop
- React should empower the native, not try to abstract it away
- Avoid writing logic in hooks, write them in classes, use DI when necessary to provide access to that logic to the needed viewmodels.
- Avoid external third party dependencies that are not pure JS when reasonable. Write what you need in terms of native code instead so updates are painless

The general architecture of this template and how it is supposed to be used can be found here: //TODO


This template is powered by tools that the community already uses, such as:
- [React native community CLI for the bare workflow](https://github.com/react-native-community/cli)
- [Inversify for Dependency injection](https://github.com/inversify/monorepo)
- [MobX for view models reactivity](https://github.com/mobxjs/mobx)
- [React Navigation for the navigation and deep linking systems](https://github.com/react-navigation/react-navigation)
- [Nitro modules for native views and native modules](https://github.com/mrousavy/nitro)
- [Jest for unit testing](https://github.com/jestjs/jest)
- [Detox for E2E testing](https://github.com/wix/Detox)
# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

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
bundle exec pod install
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

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Step 4: Add native modules and views

Depending on if you want to add native views (Say Webview, Lottie) or native modules (Bluetooth, SQL) you can go inside the `native-views` or the `native-modules` directories and define your interface in TypeScript.

You can then run 
```shell
npx nitro
```
in that directory and it will generate the respective Kotlin and Swift interfaces, that you can then use to develop your logic

For more instructions on native module setup read:

- Views: https://nitro.margelo.com/docs/view-components
- Modules: https://nitro.margelo.com/docs/how-to-build-a-nitro-module

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
