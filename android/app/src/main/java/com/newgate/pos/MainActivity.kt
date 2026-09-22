package com.newgate.pos

import android.os.Bundle
import android.view.View
import android.view.WindowManager
import com.getcapacitor.BridgeActivity
import com.newgate.pos.db.NewgatePosDbHelper
import com.newgate.pos.hardware.NewgateHardwareBridge
import com.newgate.pos.plugins.NewgatePosPlugin

class MainActivity : BridgeActivity() {

    private lateinit var hardwareBridge: NewgateHardwareBridge
    private lateinit var dbHelper: NewgatePosDbHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        // Register custom Newgate Hardware Plugin before super.onCreate
        registerPlugin(NewgatePosPlugin::class.java)
        super.onCreate(savedInstanceState)

        hardwareBridge = NewgateHardwareBridge(this, this)
        dbHelper = NewgatePosDbHelper.getInstance(this)

        // Keep screen awake for continuous POS operation
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Apply sticky immersive mode for clean appliance POS look
        enableImmersiveMode()

        // Expose direct JS bridge for high-speed local calls and native SQLite access
        bridge?.webView?.addJavascriptInterface(
            object {
                @android.webkit.JavascriptInterface
                fun pulseCashDrawer(): Boolean = hardwareBridge.pulseCashDrawer()

                @android.webkit.JavascriptInterface
                fun beep(freq: Int, duration: Int) = hardwareBridge.beep(freq, duration)

                @android.webkit.JavascriptInterface
                fun setLockTaskMode(enabled: Boolean): Boolean = hardwareBridge.setLockTaskMode(enabled)

                @android.webkit.JavascriptInterface
                fun getBatteryLevel(): Int = hardwareBridge.getBatteryLevel()

                @android.webkit.JavascriptInterface
                fun sendCustomerDisplay(line1: String, line2: String): Boolean =
                    hardwareBridge.sendCustomerDisplay(line1, line2)

                @android.webkit.JavascriptInterface
                fun sqliteSet(key: String, valueJson: String): Boolean {
                    dbHelper.setConfig(key, valueJson)
                    return true
                }

                @android.webkit.JavascriptInterface
                fun sqliteGet(key: String): String? = dbHelper.getConfig(key)
            },
            "NewgateNativeBridge"
        )
    }

    override fun onResume() {
        super.onResume()
        enableImmersiveMode()
    }

    private fun enableImmersiveMode() {
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_FULLSCREEN
        )
    }
}
