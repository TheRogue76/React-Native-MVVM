import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './views/HomeScreen/HomeScreen.tsx';
import { createStaticNavigation } from '@react-navigation/native';
import { DetailsScreen } from './views/DetailsScreen/DetailsScreen.tsx';
import { StaticParamList } from '@react-navigation/core';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  }
})

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}