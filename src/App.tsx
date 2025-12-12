/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Navigation } from './Navigation.tsx';

/**
 * Put providers here if needed
 */
function App() {
  return (
      <AppContent />
  );
}

function AppContent() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}

export default App;
