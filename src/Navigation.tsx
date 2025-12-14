import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './views/HomeScreen/HomeScreen.tsx';
import { createStaticNavigation } from '@react-navigation/native';
import { DetailsScreen } from './views/DetailsScreen/DetailsScreen.tsx';
import {
  createNavigationContainerRef,
  StaticParamList,
} from '@react-navigation/core';
import { ServiceIdentifier } from '@inversifyjs/common';
import { injectable } from '@inversifyjs/core';
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
}

@injectable()
class NavigationImpl implements Navigation {
  goBack() {
    navigationRef?.goBack();
  }

  navigate(...args: Parameters<typeof navigationRef.navigate>) {
    navigationRef?.navigate(...args);
  }
}


export const navigationSI: ServiceIdentifier<Navigation> =
  Symbol.for('NavigationInjection');

container.bind<Navigation>(navigationSI).to(NavigationImpl).inSingletonScope()