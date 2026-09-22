package com.newgate.pos.admin

import android.app.Activity
import android.app.ActivityManager
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.Build
import android.os.UserManager
import android.provider.Settings
import android.util.Log

/**
 * NewgateDevicePolicyManager
 * Coordinates Android Enterprise / Dedicated Device (COSU) device management:
 * - Device Owner / Device Admin inspection
 * - Whitelisting LockTask packages for seamless zero-prompt Kiosk pinning
 * - Keyguard and Status Bar suppression
 * - Device hardware restriction enforcement for retail POS appliance security
 */
class NewgateDevicePolicyManager(private val context: Context) {

    companion object {
        private const val TAG = "NewgateDevicePolicy"
    }

    private val dpm: DevicePolicyManager? =
        context.getSystemService(Context.DEVICE_POLICY_SERVICE) as? DevicePolicyManager

    private val activityManager: ActivityManager? =
        context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager

    val adminComponent = ComponentName(context, NewgateDeviceAdminReceiver::class.java)

    /**
     * Checks if Newgate POS is running as the enrolled Device Owner.
     */
    fun isDeviceOwner(): Boolean {
        if (dpm == null) return false
        return try {
            dpm.isDeviceOwnerApp(context.packageName)
        } catch (e: Exception) {
            Log.w(TAG, "Error checking Device Owner status: ${e.message}")
            false
        }
    }

    /**
     * Checks if Device Administrator is active.
     */
    fun isAdminActive(): Boolean {
        if (dpm == null) return false
        return try {
            dpm.isAdminActive(adminComponent)
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Checks if LockTask is permitted without user prompts (package whitelisted).
     */
    fun isLockTaskPermitted(): Boolean {
        if (dpm == null) return false
        return try {
            dpm.isLockTaskPermitted(context.packageName)
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Configures dedicated kiosk policies when enrolled as Device Owner:
     * - Whitelists package for silent LockTask
     * - Disables keyguard (lock screen)
     * - Suppresses status bar notification shade
     * - Sets screen to stay awake when charging
     * - Disables safe boot and factory reset tampering
     */
    fun configureDedicatedDeviceKiosk(): Boolean {
        if (!isDeviceOwner() || dpm == null) {
            Log.w(TAG, "Not Device Owner. Cannot enforce hardware-level dedicated device policies.")
            return false
        }

        try {
            // 1. Whitelist Newgate POS for silent, persistent LockTask
            dpm.setLockTaskPackages(adminComponent, arrayOf(context.packageName))
            Log.i(TAG, "LockTask packages configured: ${context.packageName}")

            // 2. Configure LockTask features (no system notifications, no power menu dialogs)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                dpm.setLockTaskFeatures(
                    adminComponent,
                    DevicePolicyManager.LOCK_TASK_FEATURE_NONE
                )
            }

            // 3. Disable keyguard for zero-interruption wake & boot
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                dpm.setKeyguardDisabled(adminComponent, true)
                dpm.setStatusBarDisabled(adminComponent, true)
            }

            // 4. Stay awake while plugged into AC/USB/Wireless charger
            val pluggedFlags = BatteryManager.BATTERY_PLUGGED_AC or
                    BatteryManager.BATTERY_PLUGGED_USB or
                    BatteryManager.BATTERY_PLUGGED_WIRELESS
            dpm.setGlobalSetting(
                adminComponent,
                Settings.Global.STAY_ON_WHILE_PLUGGED_IN,
                pluggedFlags.toString()
            )

            // 5. Restrict appliance tampering
            dpm.addUserRestriction(adminComponent, UserManager.DISALLOW_SAFE_BOOT)
            dpm.addUserRestriction(adminComponent, UserManager.DISALLOW_FACTORY_RESET)
            dpm.addUserRestriction(adminComponent, UserManager.DISALLOW_ADD_USER)
            dpm.addUserRestriction(adminComponent, UserManager.DISALLOW_MOUNT_PHYSICAL_MEDIA)

            Log.i(TAG, "Dedicated POS Appliance Policy applied successfully.")
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Failed applying dedicated device policy: ${e.message}", e)
            return false
        }
    }

    /**
     * Enables LockTask mode on the given Activity.
     * Uses Device Owner policy if enrolled, otherwise standard screen pinning.
     */
    fun enableLockTask(activity: Activity): Boolean {
        return try {
            if (isDeviceOwner()) {
                configureDedicatedDeviceKiosk()
            }
            activity.startLockTask()
            Log.i(TAG, "Activity startLockTask() invoked.")
            true
        } catch (e: Exception) {
            Log.e(TAG, "startLockTask failed: ${e.message}", e)
            false
        }
    }

    /**
     * Disables LockTask mode on the given Activity.
     */
    fun disableLockTask(activity: Activity): Boolean {
        return try {
            activity.stopLockTask()
            if (isDeviceOwner() && dpm != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // Re-enable status bar for administrative maintenance
                dpm.setStatusBarDisabled(adminComponent, false)
            }
            Log.i(TAG, "Activity stopLockTask() invoked.")
            true
        } catch (e: Exception) {
            Log.e(TAG, "stopLockTask failed: ${e.message}", e)
            false
        }
    }

    /**
     * Queries current LockTask mode state:
     * - "LOCKED" (Device Owner single-purpose dedicated kiosk mode)
     * - "PINNED" (Standard screen pinning mode)
     * - "NONE" (Unlocked / regular mode)
     */
    fun getLockTaskModeState(): String {
        val state = activityManager?.lockTaskModeState ?: ActivityManager.LOCK_TASK_MODE_NONE
        return when (state) {
            ActivityManager.LOCK_TASK_MODE_LOCKED -> "LOCKED"
            ActivityManager.LOCK_TASK_MODE_PINNED -> "PINNED"
            else -> "NONE"
        }
    }
}
