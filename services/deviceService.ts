/**
 * DeviceService & HardwareDeviceService
 * Discovers, registers, monitors, and abstracts hardware peripheral devices.
 */

import { HardwareDevice, DeviceType, DeviceStatus } from '../src/domain/hardwareTypes';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';

export class DeviceService {
  private static repo = new DataRepository<HardwareDevice & { id: string }>('hardware_devices');
  private static defaultDevices: HardwareDevice[] = [
    {
      id: 'term-main-1',
      name: 'Main Counter POS Terminal',
      type: 'TERMINAL',
      connectionType: 'VIRTUAL',
      status: 'ONLINE',
      isDefault: true,
      stationName: 'Front Cashier',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'printer-front-receipt',
      name: 'Epson TM-T88VI Receipt Printer',
      type: 'RECEIPT_PRINTER',
      connectionType: 'USB',
      address: 'USB-001',
      status: 'ONLINE',
      isDefault: true,
      stationName: 'Front Cashier',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'printer-kitchen-main',
      name: 'Star SP700 Kitchen Impact Printer',
      type: 'KITCHEN_PRINTER',
      connectionType: 'NETWORK',
      address: '192.168.1.150:9100',
      status: 'ONLINE',
      stationName: 'Main Kitchen',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'drawer-front-1',
      name: 'APG Series 4000 Cash Drawer',
      type: 'CASH_DRAWER',
      connectionType: 'USB',
      status: 'ONLINE',
      isDefault: true,
      stationName: 'Front Cashier',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'scanner-barcode-1',
      name: 'Zebra DS2208 Handheld Scanner',
      type: 'BARCODE_SCANNER',
      connectionType: 'USB',
      status: 'ONLINE',
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'pinpad-lane-1',
      name: 'Verifone P400 EMV PinPad',
      type: 'PAYMENT_PINPAD',
      connectionType: 'NETWORK',
      address: '192.168.1.160',
      status: 'ONLINE',
      isDefault: true,
      lastSeen: new Date().toISOString(),
    },
  ];

  static async listDevices(type?: DeviceType): Promise<HardwareDevice[]> {
    const list = await this.repo.find({
      where: type ? ({ type } as any) : undefined,
    });

    if (list.length === 0) {
      for (const d of this.defaultDevices) {
        await this.repo.upsert(d);
      }
      return this.defaultDevices.filter(d => !type || d.type === type);
    }

    return list;
  }

  static async getDevice(id: string): Promise<HardwareDevice | null> {
    const dev = await this.repo.findById(id);
    if (dev) return dev;
    return this.defaultDevices.find(d => d.id === id) || null;
  }

  static async updateStatus(id: string, status: DeviceStatus): Promise<HardwareDevice | null> {
    const dev = await this.getDevice(id);
    if (!dev) return null;

    dev.status = status;
    dev.lastSeen = new Date().toISOString();
    await this.repo.upsert(dev);
    return dev;
  }

  static async testDeviceConnection(id: string): Promise<{ success: boolean; latencyMs: number; status: DeviceStatus }> {
    const start = Date.now();
    await new Promise(res => setTimeout(res, 120)); // simulate ping
    const latencyMs = Date.now() - start;

    const dev = await this.getDevice(id);
    if (!dev) return { success: false, latencyMs: 0, status: 'ERROR' };

    dev.status = 'ONLINE';
    dev.lastSeen = new Date().toISOString();
    await this.repo.upsert(dev);

    return { success: true, latencyMs, status: 'ONLINE' };
  }

  static async registerDevice(device: HardwareDevice, employeeId: string = 'E101'): Promise<HardwareDevice> {
    await this.repo.upsert(device);
    await AuditService.log({
      actorId: employeeId,
      actorName: 'Admin',
      action: 'DEVICE_REGISTERED',
      targetType: 'HARDWARE_DEVICE',
      targetId: device.id,
      details: { name: device.name, type: device.type },
    });
    return device;
  }
}

export const HardwareDeviceService = DeviceService;
