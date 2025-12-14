import { getHostComponent } from 'react-native-nitro-modules';
const NativeViewsConfig = require('../nitrogen/generated/shared/json/NativeViewsConfig.json');
const LottieConfig = require('../nitrogen/generated/shared/json/LottieConfig.json');
import type {
  NativeViewsMethods,
  NativeViewsProps,
} from './NativeViews.nitro';
import { LottieMethods, LottieProps } from './Lottie.nitro.ts';

export const NativeViewsView = getHostComponent<
  NativeViewsProps,
  NativeViewsMethods
>('NativeViews', () => NativeViewsConfig);

export const LottieView = getHostComponent<
  LottieProps,
  LottieMethods
>('Lottie', () => LottieConfig)