/**
 * PrintSpooler
 * Asynchronous job queue, retry manager, and execution worker for hardware printers.
 */

import { PrintJob } from '../src/domain/hardwareTypes';
import { IPrinterAdapter, VirtualPrinterAdapter } from './printerAdapters';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { LocalDbService } from './localDbService';

export class PrintSpooler {
  private queue: PrintJob[] = [];
  private isProcessing = false;
  private adapters: Map<string, IPrinterAdapter> = new Map();
  private defaultAdapter: IPrinterAdapter = new VirtualPrinterAdapter();
  private jobRepo = new DataRepository<PrintJob & { id: string }>('print_jobs');

  constructor() {
    this.registerAdapter(this.defaultAdapter);
  }

  registerAdapter(adapter: IPrinterAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  getAdapter(id?: string): IPrinterAdapter {
    if (id && this.adapters.has(id)) {
      return this.adapters.get(id)!;
    }
    return this.defaultAdapter;
  }

  /**
   * Enqueues a print job and starts the spooler worker
   */
  async enqueue(job: PrintJob): Promise<PrintJob> {
    job.status = 'PENDING';
    job.retryCount = job.retryCount || 0;
    this.queue.push(job);
    await this.jobRepo.upsert(job);
    LocalDbService.enqueuePrintJob(job.type as any, job.content);

    this.processNext();
    return job;
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const job = this.queue.shift();
    if (!job) {
      this.isProcessing = false;
      return;
    }

    try {
      job.status = 'PRINTING';
      await this.jobRepo.upsert(job);
      LocalDbService.updatePrintJobStatus(job.id, 'PRINTING');

      const adapter = this.getAdapter(job.targetPrinterId);
      const res = await adapter.print(job);

      if (res.success) {
        job.status = 'COMPLETED';
        LocalDbService.updatePrintJobStatus(job.id, 'PRINTED');
      } else {
        throw new Error(res.error || 'Printing failed');
      }
    } catch (err: any) {
      job.retryCount = (job.retryCount || 0) + 1;
      job.errorMessage = err?.message || 'Print error';

      if (job.retryCount < 3) {
        job.status = 'PENDING';
        this.queue.push(job); // re-enqueue for retry
        LocalDbService.updatePrintJobStatus(job.id, 'QUEUED');
      } else {
        job.status = 'FAILED';
        LocalDbService.updatePrintJobStatus(job.id, 'FAILED');
      }
    } finally {
      await this.jobRepo.upsert(job);
      this.isProcessing = false;
      if (this.queue.length > 0) {
        setTimeout(() => this.processNext(), 100);
      }
    }
  }

  async getRecentJobs(limit: number = 20): Promise<PrintJob[]> {
    return this.jobRepo.find({
      limit,
      sortBy: 'timestamp' as any,
      sortDirection: 'desc',
    });
  }
}
