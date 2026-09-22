package com.newgate.pos.admin

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * NewgateDeviceAdminReceiver
 * Handles device administrator and Device Owner lifecycle events for dedicated POS appliances.
 */
class NewgateDeviceAdminReceiver : DeviceAdminReceiver() {

    companion object {
        private const val TAG = "NewgateDeviceAdmin"
    }

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Log.i(TAG, "Device Admin enabled for Newgate POS.")
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Log.w(TAG, "Device Admin disabled for Newgate POS.")
    }

    override fun onProfileProvisioningComplete(context: Context, intent: Intent) {
        super.onProfileProvisioningComplete(context, intent)
        Log.i(TAG, "Device Owner profile provisioning complete. Initializing dedicated kiosk policy...")
        val policyManager = NewgateDevicePolicyManager(context)
        policyManager.configureDedicatedDeviceKiosk()
    }

    override fun onLockTaskModeEntering(context: Context, intent: Intent, pkg: String) {
        super.onLockTaskModeEntering(context, intent, pkg)
        Log.i(TAG, "Newgate POS entering LockTask (Dedicated Kiosk) mode. Package: $pkg")
    }

    override fun onLockTaskModeExiting(context: Context, intent: Intent) {
        super.onLockTaskModeExiting(context, intent)
        Log.i(TAG, "Newgate POS exiting LockTask mode.")
    }
}
