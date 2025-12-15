import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { container } from '../../libs/Core/DI.ts';
import { InitializationScreenViewModel } from './InitializationScreenViewModel.ts';
import { observer } from 'mobx-react-lite';
import { Text, View } from 'react-native';

// Basic screen after splash screen, can be used for app initialization like fetching remote config etc
export const InitializationScreen = () => {
  const viewModel = container.get(InitializationScreenViewModel, {autobind: true});

  return <InitializationScreenBase viewModel={viewModel} />
}

type Props = {
  viewModel: InitializationScreenViewModel;
}

const InitializationScreenBase = observer(({viewModel}: Props) => {
  useFocusEffect(
    useCallback(() => {
      viewModel.onAppear();
    }, [viewModel]),
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Init Screen</Text>
    </View>
  )
})