import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './views/HomeScreen/HomeScreen.tsx';

const RootStack = createNativeStackNavigator()

export const Navigation = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name={'Home'} component={HomeScreen} />
    </RootStack.Navigator>
  );
}