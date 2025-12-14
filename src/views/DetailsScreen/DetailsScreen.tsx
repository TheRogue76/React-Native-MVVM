import { View } from 'react-native';
import { StaticScreenProps } from '@react-navigation/core';

type Props = StaticScreenProps<{
  id: string;
}>

export const DetailsScreen = ({} : Props) => {
  return (
    <View />
  )
}