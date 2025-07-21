import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { cryptoTracker } from "./crypto-tracker";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { 
  loginSchema, 
  signupSchema, 
  policeIntakeSchema,
  insertTraceSchema,
  type User 
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_...";

// Mock Stripe for now - in production, use real Stripe SDK
const mockStripe = {
  paymentIntents: {
    create: async (params: any) => ({
      id: `pi_${Date.now()}`,
      client_secret: `pi_${Date.now()}_secret`,
      amount: params.amount,
      currency: params.currency,
      status: "requires_payment_method",
      metadata: params.metadata,
    }),
    retrieve: async (id: string) => ({
      id,
      status: "succeeded",
      amount: 99500,
      currency: "usd",
    }),
  },
};

// Mock email service
const sendEmail = async (to: string, subject: string, body: string) => {
  console.log(`Email sent to ${to}: ${subject}`);
  console.log(body);
};

// Mock crypto tracing service
const performCryptoTrace = async (address: string, cryptoType: string) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    address,
    cryptoType,
    totalTransactions: Math.floor(Math.random() * 100) + 1,
    totalValue: `${(Math.random() * 50).toFixed(2)} ${cryptoType.split(' ')[0]}`,
    suspiciousAddresses: Math.floor(Math.random() * 10),
    riskScore: Math.random() > 0.5 ? "High" : "Medium",
    connectedAddresses: [
      `addr_${Math.random().toString(36).substring(7)}`,
      `addr_${Math.random().toString(36).substring(7)}`,
    ],
    analysisTimestamp: new Date().toISOString(),
  };
};

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Police webhook endpoint for officer/victim data intake
  app.post("/api/intake", async (req, res) => {
    try {
      const data = policeIntakeSchema.parse(req.body);
      
      // Verify department API key
      const department = await storage.getDepartmentByApiKey(data.apiKey);
      if (!department) {
        return res.status(401).json({ message: "Invalid API key" });
      }

      const results = {
        officersProcessed: [],
        tracesCreated: [],
        signupLinks: [],
      };

      // Process officers
      for (const officerData of data.officers) {
        const existingUser = await storage.getUserByEmail(officerData.email);
        
        if (!existingUser) {
          // Create signup token
          const signupToken = await storage.createSignupToken(officerData.email, department.id);
          const signupLink = `${process.env.BASE_URL || 'http://localhost:5000'}/signup?token=${signupToken}`;
          
          // Send secure signup email
          await sendEmail(
            officerData.email,
            "CryptoTrace Account Setup",
            `Hello ${officerData.name},\n\nYour department has registered you for CryptoTrace access. Please complete your account setup here: ${signupLink}\n\nThis link expires in 24 hours.`
          );

          results.officersProcessed.push({ email: officerData.email, status: "signup_sent" });
          results.signupLinks.push({ email: officerData.email, link: signupLink });
        } else {
          results.officersProcessed.push({ email: officerData.email, status: "already_exists" });
        }
      }

      // Process victim cases and create trace requests
      for (const victimData of data.victims) {
        const trace = await storage.createTrace({
          caseNumber: victimData.caseNumber,
          userId: 1, // Temporary - assign to admin until officer signs up
          cryptoType: victimData.cryptoType,
          walletAddress: victimData.cryptoAddress,
          victimName: victimData.name,
          incidentDate: new Date(victimData.incidentDate),
          description: victimData.description,
          status: "queued",
          isPremium: false,
          paymentIntentId: null,
          estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        results.tracesCreated.push({ caseNumber: victimData.caseNumber, traceId: trace.id });
      }

      res.json({
        message: "Intake processed successfully",
        departmentId: department.id,
        ...results,
      });

    } catch (error) {
      console.error("Intake error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In production, use proper bcrypt comparison
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          department: user.department,
          badgeNumber: user.badgeNumber,
          role: user.role,
        },
      });

    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      // Modified signup schema for public registration
      const publicSignupSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        department: z.string().min(1),
        badgeNumber: z.string().min(1),
        signupToken: z.string().min(0).optional(), // Allow empty string or undefined
      });

      const data = publicSignupSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        department: data.department,
        badgeNumber: data.badgeNumber,
        role: "officer",
        isActive: true,
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          department: user.department,
          badgeNumber: user.badgeNumber,
          role: user.role,
        },
      });

    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Trace routes
  app.get("/api/traces", authenticateToken, async (req, res) => {
    try {
      let traces;
      if (req.user.role === 'admin' || req.user.role === 'super_admin') {
        traces = await storage.getAllTraces();
      } else {
        traces = await storage.getTracesByUser(req.user.id);
      }
      res.json(traces);
    } catch (error) {
      res.status(500).json({ message: "Error fetching traces" });
    }
  });

  app.post("/api/traces", authenticateToken, async (req, res) => {
    try {
      const traceData = insertTraceSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: req.body.isPremium ? "pending_payment" : "queued",
        estimatedCompletion: req.body.isPremium 
          ? new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours for premium
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days for free
      });

      const trace = await storage.createTrace(traceData);

      // If premium, create Stripe payment intent
      if (req.body.isPremium) {
        const paymentIntent = await mockStripe.paymentIntents.create({
          amount: 99500, // $995 in cents
          currency: 'usd',
          metadata: { traceId: trace.id.toString(), userId: req.user.id.toString() },
        });

        await storage.updateTrace(trace.id, {
          paymentIntentId: paymentIntent.id,
        });

        res.json({
          trace,
          clientSecret: paymentIntent.client_secret,
        });
      } else {
        // For free traces, start processing immediately (in real app, this would be queued)
        setTimeout(async () => {
          try {
            const results = await performCryptoTrace(trace.walletAddress, trace.cryptoType);
            await storage.updateTrace(trace.id, {
              status: "completed",
              results,
              completedAt: new Date(),
              reportUrl: `/reports/trace-${trace.id}-report.pdf`,
            });

            // Send email notification
            await sendEmail(
              req.user.email,
              `Trace Completed: Case ${trace.caseNumber}`,
              `Your cryptocurrency trace for case ${trace.caseNumber} has been completed. View the results in your dashboard.`
            );
          } catch (error) {
            await storage.updateTrace(trace.id, { status: "failed" });
          }
        }, 5000); // 5 second delay for demo

        res.json({ trace });
      }

    } catch (error) {
      console.error("Trace creation error:", error);
      res.status(400).json({ message: "Invalid trace data" });
    }
  });

  // Payment webhook (Stripe webhook in production)
  app.post("/api/payments/webhook", async (req, res) => {
    try {
      const { paymentIntentId, status } = req.body;
      
      // Find trace by payment intent
      const traces = await storage.getAllTraces();
      const trace = traces.find(t => t.paymentIntentId === paymentIntentId);
      
      if (!trace) {
        return res.status(404).json({ message: "Trace not found" });
      }

      if (status === 'succeeded') {
        // Update trace status and start processing
        await storage.updateTrace(trace.id, { status: "processing" });

        // Create payment record
        await storage.createPaymentRecord({
          traceId: trace.id,
          userId: trace.userId,
          stripePaymentIntentId: paymentIntentId,
          amount: 99500,
          status: "succeeded",
        });

        // Start premium trace processing
        setTimeout(async () => {
          try {
            const results = await performCryptoTrace(trace.walletAddress, trace.cryptoType);
            await storage.updateTrace(trace.id, {
              status: "completed",
              results,
              completedAt: new Date(),
              reportUrl: `/reports/trace-${trace.id}-report.pdf`,
            });

            const user = await storage.getUser(trace.userId);
            if (user) {
              await sendEmail(
                user.email,
                `Premium Trace Completed: Case ${trace.caseNumber}`,
                `Your premium cryptocurrency trace for case ${trace.caseNumber} has been completed. View the detailed results in your dashboard.`
              );
            }
          } catch (error) {
            await storage.updateTrace(trace.id, { status: "failed" });
          }
        }, 2000); // 2 second delay for demo
      }

      res.json({ success: true });

    } catch (error) {
      res.status(400).json({ message: "Webhook error" });
    }
  });

  // Admin routes
  app.get("/api/admin/dashboard", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const traces = await storage.getAllTraces();
      const users = Array.from((storage as any).users.values()).filter((u: User) => u.role === 'officer');

      const stats = {
        activeTraces: traces.filter(t => t.status === 'processing' || t.status === 'queued').length,
        completed: traces.filter(t => t.status === 'completed').length,
        totalOfficers: users.length,
        monthlySpend: traces
          .filter(t => t.isPremium && t.status === 'completed')
          .length * 995, // $995 per premium trace
      };

      res.json({ stats, traces, officers: users });

    } catch (error) {
      res.status(500).json({ message: "Error fetching admin data" });
    }
  });

  // Generate trace report
  app.post("/api/traces/:id/generate-report", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trace = await storage.getTrace(id);
      
      if (!trace) {
        return res.status(404).json({ message: "Trace not found" });
      }

      // Start the blockchain analysis
      await storage.updateTrace(id, { status: "processing" });
      
      // Generate the analysis report
      const report = await cryptoTracker.traceAddress(
        trace.walletAddress,
        trace.cryptoType
      );

      // Update trace with completed status
      await storage.updateTrace(id, { status: "completed" });

      res.json({
        message: "Report generated successfully",
        report,
        traceId: id
      });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      department: req.user.department,
      badgeNumber: req.user.badgeNumber,
      role: req.user.role,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
