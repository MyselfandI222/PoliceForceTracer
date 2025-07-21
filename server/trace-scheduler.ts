import { storage } from "./storage";
import { cryptoTracker } from "./crypto-tracker";

class TraceScheduler {
  private isProcessing = false;

  constructor() {
    this.startScheduler();
  }

  private startScheduler() {
    // Check every minute if it's time to process
    setInterval(() => {
      this.checkAndProcessTraces();
    }, 60000); // 60 seconds

    console.log("Trace scheduler started - free traces will process on Wednesdays at 11:59 PM");
  }

  private async checkAndProcessTraces() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 3 = Wednesday

    // Process free traces on Wednesdays at 11:59 PM (23:59)
    if (dayOfWeek === 3 && hour === 23 && minute === 59 && !this.isProcessing) {
      await this.processFreeTraces();
    }
  }

  private async processFreeTraces() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log("Starting scheduled processing of free traces at", new Date().toISOString());

    try {
      // Get all queued free traces
      const allTraces = await storage.getAllTraces();
      const freeTracesToProcess = allTraces.filter(trace => 
        trace.status === 'queued' && !trace.isPremium
      );

      console.log(`Processing ${freeTracesToProcess.length} free traces`);

      for (const trace of freeTracesToProcess) {
        try {
          // Update status to processing
          await storage.updateTrace(trace.id, { status: 'processing' });
          
          // Generate the trace report
          const report = await cryptoTracker.traceAddress(
            trace.walletAddress,
            trace.cryptoType
          );

          // Update to completed
          await storage.updateTrace(trace.id, { 
            status: 'completed',
            completedAt: new Date()
          });

          console.log(`Completed trace ${trace.id} for case ${trace.caseNumber}`);

          // Simulate sending notification email
          console.log(`Email notification sent for completed trace ${trace.caseNumber}`);

        } catch (error) {
          console.error(`Failed to process trace ${trace.id}:`, error);
          await storage.updateTrace(trace.id, { status: 'failed' });
        }
      }

      console.log("Scheduled trace processing completed");
    } catch (error) {
      console.error("Error in scheduled trace processing:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Method to immediately process premium traces
  public async processPremiumTrace(traceId: number) {
    try {
      const trace = await storage.getTrace(traceId);
      if (!trace || !trace.isPremium) {
        throw new Error("Invalid premium trace");
      }

      // Update status to processing
      await storage.updateTrace(traceId, { status: 'processing' });
      
      console.log(`Processing premium trace ${traceId} immediately`);

      // Generate the trace report
      const report = await cryptoTracker.traceAddress(
        trace.walletAddress,
        trace.cryptoType
      );

      // Update to completed
      await storage.updateTrace(traceId, { 
        status: 'completed',
        completedAt: new Date()
      });

      console.log(`Premium trace ${traceId} completed in real-time`);
      return report;

    } catch (error) {
      console.error(`Failed to process premium trace ${traceId}:`, error);
      await storage.updateTrace(traceId, { status: 'failed' });
      throw error;
    }
  }

  // Get next scheduled processing time for free traces
  public getNextProcessingTime(): Date {
    const now = new Date();
    const nextRun = new Date();
    
    // Calculate days until next Wednesday
    const currentDay = now.getDay(); // 0 = Sunday, 3 = Wednesday
    let daysUntilWednesday = (3 - currentDay + 7) % 7;
    
    // If it's Wednesday but past 11:59 PM, schedule for next Wednesday
    if (currentDay === 3) {
      const todayAt1159 = new Date(now);
      todayAt1159.setHours(23, 59, 0, 0);
      
      if (now.getTime() >= todayAt1159.getTime()) {
        daysUntilWednesday = 7; // Next Wednesday
      } else {
        daysUntilWednesday = 0; // Today (Wednesday)
      }
    }
    
    nextRun.setDate(now.getDate() + daysUntilWednesday);
    nextRun.setHours(23, 59, 0, 0);
    
    return nextRun;
  }

  // Get estimated completion time for a new trace
  public getEstimatedCompletion(isPremium: boolean): Date {
    if (isPremium) {
      // Premium traces complete in 1-2 hours
      const completion = new Date();
      completion.setHours(completion.getHours() + 1);
      return completion;
    } else {
      // Free traces complete at next Wednesday 11:59 PM
      return this.getNextProcessingTime();
    }
  }
}

export const traceScheduler = new TraceScheduler();