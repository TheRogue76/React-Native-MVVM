import { Text, View } from 'react-native';

export const ProfileScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text testID={'profile_main'}>Profile</Text>
    </View>
  )
}