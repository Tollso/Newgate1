package com.newgate.pos.plugins

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.newgate.pos.hardware.NewgateHardwareBridge

@CapacitorPlugin(name = "NewgatePosPlugin")
class NewgatePosPlugin : Plugin() {

    private lateinit var hardwareBridge: NewgateHardwareBridge

    override fun load() {
        super.load()
        hardwareBridge = NewgateHardwareBridge(context, activity)
    }

    @PluginMethod
    fun pulseCashDrawer(call: PluginCall) {
        val printerIp = call.getString("printerIp") ?: "192.168.1.200"
        val printerPort = call.getInt("printerPort") ?: 9100
        val success = hardwareBridge.pulseCashDrawer(printerIp, printerPort)
        val ret = JSObject()
        ret.put("success", success)
        call.resolve(ret)
    }

    @PluginMethod
    fun beep(call: PluginCall) {
        val freq = call.getInt("toneFrequency") ?: 2000
        val duration = call.getInt("durationMs") ?: 100
        hardwareBridge.beep(freq, duration)
        call.resolve()
    }

    @PluginMethod
    fun setLockTaskMode(call: PluginCall) {
        val enabled = call.getBoolean("enabled") ?: false
        val success = hardwareBridge.setLockTaskMode(enabled)
        val ret = JSObject()
        ret.put("success", success)
        call.resolve(ret)
    }

    @PluginMethod
    fun getBatteryLevel(call: PluginCall) {
        val level = hardwareBridge.getBatteryLevel()
        val ret = JSObject()
        ret.put("batteryLevel", level)
        call.resolve(ret)
    }

    @PluginMethod
    fun sendCustomerDisplay(call: PluginCall) {
        val line1 = call.getString("line1") ?: ""
        val line2 = call.getString("line2") ?: ""
        val success = hardwareBridge.sendCustomerDisplay(line1, line2)
        val ret = JSObject()
        ret.put("success", success)
        call.resolve(ret)
    }

    @PluginMethod
    fun printReceipt(call: PluginCall) {
        val printerIp = call.getString("printerIp") ?: "192.168.1.200"
        val printerPort = call.getInt("printerPort") ?: 9100
        val rawText = call.getString("rawText") ?: ""
        val success = hardwareBridge.printRawEscPos(printerIp, printerPort, rawText.toByteArray(Charsets.UTF_8))
        val ret = JSObject()
        ret.put("success", success)
        call.resolve(ret)
    }

    @PluginMethod
    fun sqliteSet(call: PluginCall) {
        val key = call.getString("key") ?: run {
            call.reject("Missing key")
            return
        }
        val valueJson = call.getString("value") ?: ""
        val dbHelper = com.newgate.pos.db.NewgatePosDbHelper.getInstance(context)
        dbHelper.setConfig(key, valueJson)
        val ret = JSObject()
        ret.put("success", true)
        call.resolve(ret)
    }

    @PluginMethod
    fun sqliteGet(call: PluginCall) {
        val key = call.getString("key") ?: run {
            call.reject("Missing key")
            return
        }
        val dbHelper = com.newgate.pos.db.NewgatePosDbHelper.getInstance(context)
        val value = dbHelper.getConfig(key)
        val ret = JSObject()
        ret.put("value", value)
        call.resolve(ret)
    }
}
