import { Text, View } from 'react-native';
import { StaticScreenProps } from '@react-navigation/core';

type Props = StaticScreenProps<{
  id: string;
}>

export const DetailsScreen = ({} : Props) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
    </View>
  )
}