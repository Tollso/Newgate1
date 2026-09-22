package com.newgate.pos.receivers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.newgate.pos.MainActivity

/**
 * BootReceiver
 * Ensures Newgate POS automatically launches immediately upon device boot,
 * cold power-on, quickboot, or package update for dedicated appliance kiosk operation.
 */
class BootReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "NewgateBootReceiver"
    }

    override fun onReceive(context: Context, intent: Intent?) {
        val action = intent?.action ?: return
        Log.i(TAG, "Newgate POS BootReceiver triggered with action: $action")

        if (Intent.ACTION_BOOT_COMPLETED == action ||
            Intent.ACTION_LOCKED_BOOT_COMPLETED == action ||
            "android.intent.action.QUICKBOOT_POWERON" == action ||
            "com.htc.intent.action.QUICKBOOT_POWERON" == action ||
            Intent.ACTION_MY_PACKAGE_REPLACED == action
        ) {
            Log.i(TAG, "Initiating automatic foreground startup of Newgate POS...")
            try {
                val launchIntent = Intent(context, MainActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                    putExtra("AUTO_LAUNCHED_ON_BOOT", true)
                    putExtra("BOOT_ACTION", action)
                }
                context.startActivity(launchIntent)
                Log.i(TAG, "Newgate POS MainActivity started successfully from boot.")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to start Newgate POS on boot: ${e.message}", e)
            }
        }
    }
}
