import { Button, Pressable, Text, View } from 'react-native';
import { HomeScreenViewModel } from './HomeScreenViewModel.ts';
import { observer } from 'mobx-react-lite';
import { multiply } from 'native-modules';
import { NativeViewsView } from 'native-views';

interface Props {
  state: Extract<HomeScreenViewModel['state'], {type : 'loaded'}>;
  onButtonPress: () => void;
}

export const HomeScreenContent = observer(({ state, onButtonPress }: Props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text testID={'home_counter'}>
        Home Screen counter {state.data.counter}
      </Text>
      <Text>{multiply(2, 3)}</Text>
      <NativeViewsView color={'black'} style={{ width: 100, height: 100 }} />
      <Pressable onPress={onButtonPress}>
        <Text>Go to Details</Text>
      </Pressable>
    </View>
  );
});