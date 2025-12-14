//
//  LottieView.swift
//  Pods
//
//  Created by Parsa Nasirimehr on 2025-12-14.
//

import Foundation
import Lottie

class HybridLottie : HybridLottieSpec {
    var view: UIView = LottieAnimationView()

    var url: String = "" {
        didSet {
            guard let url = URL(string: url) else { return }
            Task {
                guard let animation = await LottieAnimation.loadedFrom(url: url) else { return }
                await MainActor.run {
                    guard let lottieView = view as? LottieAnimationView else { return }
                    lottieView.animation = animation
                    lottieView.loopMode = .loop
                    lottieView.play()
                }
            }
        }
    }
}
