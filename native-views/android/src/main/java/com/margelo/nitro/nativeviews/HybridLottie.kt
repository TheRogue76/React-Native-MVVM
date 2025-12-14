package com.margelo.nitro.nativeviews

import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieDrawable
import com.facebook.react.uimanager.ThemedReactContext

class HybridLottie(val context: ThemedReactContext): HybridLottieSpec() {
    override val view: LottieAnimationView = LottieAnimationView(context).apply {
        repeatCount = LottieDrawable.INFINITE
    }

    private var _url: String = ""
    override var url: String
        get() = _url
        set(value) {
            _url = value
            view.setAnimationFromUrl(value)
            view.playAnimation()
        }
}