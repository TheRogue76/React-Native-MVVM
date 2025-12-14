import { Button, Text, View } from 'react-native';
import { HomeScreenViewModel } from './HomeScreenViewModel.ts';
import { observer } from 'mobx-react-lite';
import { multiply } from 'native-modules';
import { NativeViewsView, LottieView } from 'native-views';

interface Props {
  state: Extract<HomeScreenViewModel['state'], {type : 'loaded'}>;
  onButtonPress: () => void;
}

export const HomeScreenContent = observer(({ state, onButtonPress }: Props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen counter {state.data.counter}</Text>
      <Text>{multiply(2, 3)}</Text>
      <NativeViewsView color={'black'} style={{ width: 100, height: 100 }} />
      <LottieView
        url={
          'https://raw.githubusercontent.com/lottie-react-native/lottie-react-native/master/example/animations/Watermelon.json'
        }
        style={{height: 200, width: 100}}
      />
      <Button title="Go to Details" onPress={onButtonPress} />
    </View>
  );
});