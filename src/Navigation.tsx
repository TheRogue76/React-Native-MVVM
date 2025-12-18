import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './views/HomeScreen/HomeScreen.tsx';
import { createStaticNavigation } from '@react-navigation/native';
import { DetailsScreen } from './views/DetailsScreen/DetailsScreen.tsx';
import {
  createNavigationContainerRef,
  StaticParamList,
} from '@react-navigation/core';
import {
  createToken,
  singleton,
} from 'launchpad-dependency-injection';
import { container } from './libs/Core/DI.ts';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { InitializationScreen } from './views/InitializationScreen/InitializationScreen.tsx';
import { ProfileScreen } from './views/ProfileScreen/ProfileScreen.tsx';

const HomeStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  }
});

const ProfileStack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
  }
});

const BottomNavigationStack = createNativeBottomTabNavigator({
  screens: {
    HomeStack: HomeStack,
    ProfileStack: ProfileStack,
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Initialization',
  screens: {
    Initialization: InitializationScreen,
    TabbedNavigator: BottomNavigationStack,
    Details: DetailsScreen,
  },
});

const NavigationWrapper = createStaticNavigation(RootStack);
const navigationRef = createNavigationContainerRef();

export function NavComponent() {
  return <NavigationWrapper ref={navigationRef} />;
}

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface Navigation {
  goBack: () => void;
  navigate: typeof navigationRef.navigate;
  reset: typeof navigationRef.reset;
}

@singleton()
class NavigationImpl implements Navigation {
  goBack() {
    navigationRef?.goBack();
  }

  navigate(
    ...args: Parameters<typeof navigationRef.navigate>
  ): ReturnType<typeof navigationRef.navigate> {
    navigationRef?.navigate(...args);
  }

  reset(
    ...args: Parameters<typeof navigationRef.reset>
  ): ReturnType<typeof navigationRef.reset> {
    navigationRef?.reset(...args)
  }
}


export const navigationSI = createToken<Navigation>('NavigationInjection');

container.register(navigationSI, NavigationImpl);