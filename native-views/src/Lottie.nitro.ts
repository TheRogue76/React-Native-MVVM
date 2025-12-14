import type { HybridView, HybridViewMethods, HybridViewProps } from 'react-native-nitro-modules';

export interface LottieProps extends HybridViewProps {
  url: string;
}
export interface LottieMethods extends HybridViewMethods {}

export type Lottie = HybridView<LottieProps, LottieMethods>;