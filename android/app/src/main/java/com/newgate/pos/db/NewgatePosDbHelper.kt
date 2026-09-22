package com.newgate.pos.db

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import org.json.JSONArray
import org.json.JSONObject

/**
 * NewgatePosDbHelper
 * Native Android SQLite / Room-compatible persistence engine for Newgate POS Appliance.
 * Durable local storage for:
 * 1. Open Orders
 * 2. Dining Tables & Guest/Seat State
 * 3. Employee Permission Snapshots
 * 4. KDS Tickets (Kitchen Dispatch)
 * 5. Print Queue (ESC/POS & Kitchen Jobs)
 * 6. Sync Queue (Idempotent Outbox)
 * 7. Business Day & Cash Drawer State
 * 8. Device Config & Hardware Binding
 */
class NewgatePosDbHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        const val DATABASE_NAME = "newgate_pos_appliance.db"
        const val DATABASE_VERSION = 1

        // Table names
        const val TABLE_OPEN_ORDERS = "open_orders"
        const val TABLE_DINING_TABLES = "dining_tables"
        const val TABLE_EMPLOYEE_PERMS = "employee_permission_snapshots"
        const val TABLE_KDS_TICKETS = "kds_tickets"
        const val TABLE_PRINT_QUEUE = "print_queue"
        const val TABLE_SYNC_QUEUE = "sync_queue"
        const val TABLE_BUSINESS_DAY = "business_day"
        const val TABLE_DEVICE_CONFIG = "device_config"

        @Volatile
        private var instance: NewgatePosDbHelper? = null

        fun getInstance(context: Context): NewgatePosDbHelper =
            instance ?: synchronized(this) {
                instance ?: NewgatePosDbHelper(context.applicationContext).also { instance = it }
            }
    }

    override fun onCreate(db: SQLiteDatabase) {
        // 1. Open Orders
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_OPEN_ORDERS (
                id TEXT PRIMARY KEY,
                order_number TEXT,
                table_id TEXT,
                status TEXT,
                total_amount REAL,
                data_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        """.trimIndent())

        // 2. Dining Tables
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_DINING_TABLES (
                id TEXT PRIMARY KEY,
                table_number TEXT,
                section TEXT,
                status TEXT,
                capacity INTEGER,
                data_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        """.trimIndent())

        // 3. Employee Permission Snapshots
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_EMPLOYEE_PERMS (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                pin_hash TEXT,
                permissions_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        """.trimIndent())

        // 4. KDS Tickets
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_KDS_TICKETS (
                id TEXT PRIMARY KEY,
                order_id TEXT,
                station TEXT,
                status TEXT,
                data_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
        """.trimIndent())

        // 5. Print Queue
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_PRINT_QUEUE (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                content TEXT NOT NULL,
                status TEXT NOT NULL,
                retry_count INTEGER DEFAULT 0,
                created_at TEXT NOT NULL
            );
        """.trimIndent())

        // 6. Sync Queue (Outbox)
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_SYNC_QUEUE (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                idempotency_key TEXT UNIQUE NOT NULL,
                status TEXT NOT NULL,
                timestamp TEXT NOT NULL
            );
        """.trimIndent())

        // 7. Business Day
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_BUSINESS_DAY (
                business_date TEXT PRIMARY KEY,
                is_open INTEGER NOT NULL,
                drawer_float REAL NOT NULL,
                active_shift_id TEXT,
                data_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        """.trimIndent())

        // 8. Device Config
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS $TABLE_DEVICE_CONFIG (
                config_key TEXT PRIMARY KEY,
                config_value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        """.trimIndent())
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // Upgrade migrations
    }

    // Generic Key-Value persistence helper for rapid bridge synchronization
    fun setConfig(key: String, valueJson: String) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("config_key", key)
            put("config_value", valueJson)
            put("updated_at", System.currentTimeMillis().toString())
        }
        db.insertWithOnConflict(TABLE_DEVICE_CONFIG, null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun getConfig(key: String): String? {
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT config_value FROM $TABLE_DEVICE_CONFIG WHERE config_key = ? LIMIT 1", arrayOf(key))
        return cursor.use {
            if (it.moveToFirst()) it.getString(0) else null
        }
    }

    // 1. Open Orders Operations
    fun saveOpenOrders(ordersJsonArray: String) {
        val db = writableDatabase
        db.beginTransaction()
        try {
            db.delete(TABLE_OPEN_ORDERS, null, null)
            val array = JSONArray(ordersJsonArray)
            for (i in 0 until array.length()) {
                val item = array.getJSONObject(i)
                val values = ContentValues().apply {
                    put("id", item.optString("id"))
                    put("order_number", item.optString("orderNumber", item.optString("id")))
                    put("table_id", item.optString("tableId", ""))
                    put("status", item.optString("status", "OPEN"))
                    put("total_amount", item.optDouble("total", 0.0))
                    put("data_json", item.toString())
                    put("updated_at", System.currentTimeMillis().toString())
                }
                db.insertWithOnConflict(TABLE_OPEN_ORDERS, null, values, SQLiteDatabase.CONFLICT_REPLACE)
            }
            db.setTransactionSuccessful()
        } finally {
            db.endTransaction()
        }
    }

    fun getOpenOrders(): String {
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT data_json FROM $TABLE_OPEN_ORDERS ORDER BY updated_at DESC", null)
        val array = JSONArray()
        cursor.use {
            while (it.moveToNext()) {
                val jsonStr = it.getString(0)
                try {
                    array.put(JSONObject(jsonStr))
                } catch (e: Exception) {
                    // fallback
                }
            }
        }
        return array.toString()
    }

    // 2. Tables Operations
    fun saveTablesState(tablesJson: String) {
        setConfig("tables_state", tablesJson)
    }

    fun getTablesState(): String? {
        return getConfig("tables_state")
    }

    // 3. Employee Permission Snapshots
    fun saveEmployeeSnapshot(employeesJson: String) {
        setConfig("employee_permission_snapshot", employeesJson)
    }

    fun getEmployeeSnapshot(): String? {
        return getConfig("employee_permission_snapshot")
    }

    // 4. KDS Tickets
    fun saveKdsTickets(kdsJson: String) {
        setConfig("kds_tickets", kdsJson)
    }

    fun getKdsTickets(): String? {
        return getConfig("kds_tickets")
    }

    // 5. Print Queue
    fun savePrintQueue(printJobsJson: String) {
        setConfig("print_queue", printJobsJson)
    }

    fun getPrintQueue(): String? {
        return getConfig("print_queue")
    }

    // 6. Sync Queue (Outbox)
    fun saveSyncQueue(syncQueueJson: String) {
        setConfig("sync_queue", syncQueueJson)
    }

    fun getSyncQueue(): String? {
        return getConfig("sync_queue")
    }

    // 7. Business Day
    fun saveBusinessDay(businessDayJson: String) {
        setConfig("business_day", businessDayJson)
    }

    fun getBusinessDay(): String? {
        return getConfig("business_day")
    }

    // 8. Device Config
    fun saveDeviceRecord(deviceJson: String) {
        setConfig("device_config_record", deviceJson)
    }

    fun getDeviceRecord(): String? {
        return getConfig("device_config_record")
    }
}
