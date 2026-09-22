package com.newgate.pos.hardware

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.ToneGenerator
import android.media.AudioManager
import android.os.BatteryManager
import android.util.Log
import java.io.OutputStream
import java.net.InetSocketAddress
import java.net.Socket

/**
 * Hardware Abstraction Layer (HAL) for Newgate POS
 * Connects POS JavaScript runtime to real Android peripherals:
 * - Thermal Receipt Printers (ESC/POS over TCP/USB/Bluetooth)
 * - Cash Drawer Solenoid Kick
 * - Hardware Barcode Scanners
 * - Customer Facing Display (CFD)
 * - Android Kiosk / LockTask mode
 */
class NewgateHardwareBridge(private val context: Context, private val activity: Activity?) {

    companion object {
        private const val TAG = "NewgateHAL"
        // Standard ESC/POS solenoid kick command: ESC p 0 25 250
        val DRAWER_KICK_CMD = byteArrayOf(0x1B, 0x70, 0x00, 0x19, 0xFA.toByte())
        // Standard ESC/POS cut paper: GS V 66 0
        val CUT_PAPER_CMD = byteArrayOf(0x1D, 0x56, 0x42, 0x00)
    }

    private var toneGenerator: ToneGenerator? = null

    init {
        try {
            toneGenerator = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 100)
        } catch (e: Exception) {
            Log.w(TAG, "Tone generator unavailable: ${e.message}")
        }
    }

    /**
     * Pulses the cash drawer solenoid attached to the receipt printer or direct GPIO
     */
    fun pulseCashDrawer(printerIp: String = "192.168.1.200", printerPort: Int = 9100): Boolean {
        Log.i(TAG, "Triggering Cash Drawer Pulse...")
        beep(2000, 100)

        // Try direct TCP socket to receipt printer solenoid
        Thread {
            try {
                val socket = Socket()
                socket.connect(InetSocketAddress(printerIp, printerPort), 1500)
                val out: OutputStream = socket.getOutputStream()
                out.write(DRAWER_KICK_CMD)
                out.flush()
                socket.close()
                Log.i(TAG, "Cash drawer solenoid fired successfully via $printerIp:$printerPort")
            } catch (e: Exception) {
                Log.w(TAG, "Could not reach hardware printer for cash drawer pulse: ${e.message}")
            }
        }.start()

        return true
    }

    /**
     * Plays confirmation or alert beeps via internal speaker
     */
    fun beep(toneFrequency: Int = 2000, durationMs: Int = 100) {
        try {
            toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, durationMs)
        } catch (e: Exception) {
            Log.w(TAG, "Beep failed: ${e.message}")
        }
    }

    /**
     * Toggles Android Kiosk LockTask mode for dedicated POS appliance operation
     */
    fun setLockTaskMode(enabled: Boolean): Boolean {
        if (activity == null) return false
        try {
            if (enabled) {
                activity.startLockTask()
                Log.i(TAG, "POS LockTask (Kiosk) enabled.")
            } else {
                activity.stopLockTask()
                Log.i(TAG, "POS LockTask (Kiosk) disabled.")
            }
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Error toggling LockTask mode: ${e.message}")
            return false
        }
    }

    /**
     * Reads actual battery percentage for mobile/tablet terminals
     */
    fun getBatteryLevel(): Int {
        val ifilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus: Intent? = context.registerReceiver(null, ifilter)
        val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        return if (level >= 0 && scale > 0) {
            (level * 100) / scale
        } else {
            100
        }
    }

    /**
     * Sends line updates to Customer Display (CFD) / 2x20 VFD pole display
     */
    fun sendCustomerDisplay(line1: String, line2: String): Boolean {
        Log.i(TAG, "Customer Display update: [$line1] / [$line2]")
        // Broadcast to auxiliary presentation display or connected serial pole display
        val intent = Intent("com.newgate.pos.CUSTOMER_DISPLAY_UPDATE").apply {
            putExtra("line1", line1)
            putExtra("line2", line2)
        }
        context.sendBroadcast(intent)
        return true
    }

    /**
     * Sends raw ESC/POS receipt data to network/USB thermal receipt printer
     */
    fun printRawEscPos(printerIp: String, printerPort: Int, data: ByteArray): Boolean {
        Thread {
            try {
                val socket = Socket()
                socket.connect(InetSocketAddress(printerIp, printerPort), 3000)
                val out: OutputStream = socket.getOutputStream()
                out.write(data)
                out.write(CUT_PAPER_CMD)
                out.flush()
                socket.close()
                Log.i(TAG, "Printed ${data.size} bytes to $printerIp:$printerPort")
            } catch (e: Exception) {
                Log.e(TAG, "Printer failed to send payload to $printerIp:$printerPort: ${e.message}")
            }
        }.start()
        return true
    }
}
