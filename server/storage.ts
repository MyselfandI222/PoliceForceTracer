import { 
  users, traces, departments, paymentRecords,
  type User, type InsertUser, 
  type Trace, type InsertTrace,
  type Department, type InsertDepartment,
  type PaymentRecord, type InsertPaymentRecord
} from "@shared/schema";
import * as crypto from "crypto";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Traces
  getTrace(id: number): Promise<Trace | undefined>;
  getTracesByUser(userId: number): Promise<Trace[]>;
  getAllTraces(): Promise<Trace[]>;
  createTrace(trace: InsertTrace): Promise<Trace>;
  updateTrace(id: number, updates: Partial<Trace>): Promise<Trace | undefined>;
  
  // Departments
  getDepartment(id: number): Promise<Department | undefined>;
  getDepartmentByApiKey(apiKey: string): Promise<Department | undefined>;
  createDepartment(dept: InsertDepartment): Promise<Department>;
  
  // Payments
  createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord>;
  getPaymentByTraceId(traceId: number): Promise<PaymentRecord | undefined>;
  
  // Auth helpers
  createSignupToken(email: string, departmentId: number): Promise<string>;
  validateSignupToken(token: string): Promise<{ email: string; departmentId: number } | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private traces: Map<number, Trace> = new Map();
  private departments: Map<number, Department> = new Map();
  private paymentRecords: Map<number, PaymentRecord> = new Map();
  private signupTokens: Map<string, { email: string; departmentId: number; expires: Date }> = new Map();
  
  private currentUserId = 1;
  private currentTraceId = 1;
  private currentDeptId = 1;
  private currentPaymentId = 1;

  constructor() {
    // Create default department
    const defaultDept: Department = {
      id: this.currentDeptId++,
      name: "Metro PD Cyber Crimes Unit",
      contactEmail: "cybercrime@metropd.gov",
      apiKey: "test-api-key-123",
      isActive: true,
      monthlyBudget: "50000.00",
      createdAt: new Date(),
    };
    this.departments.set(defaultDept.id, defaultDept);

    // Create default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      email: "admin@metropd.gov",
      password: "$2b$10$hash", // In real app, this would be properly hashed
      name: "Det. Sarah Johnson",
      department: "Metro PD - Cyber Crimes",
      badgeNumber: "4421",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create some sample traces for demo
    const sampleTrace1: Trace = {
      id: this.currentTraceId++,
      caseNumber: "2024-001",
      userId: adminUser.id,
      cryptoType: "Bitcoin (BTC)",
      walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      victimName: "John Doe",
      incidentDate: new Date("2024-01-15"),
      description: "Cryptocurrency theft via phishing attack",
      status: "processing",
      isPremium: false,
      paymentIntentId: null,
      results: null,
      reportUrl: null,
      estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completedAt: null,
      createdAt: new Date(),
    };
    this.traces.set(sampleTrace1.id, sampleTrace1);

    const sampleTrace2: Trace = {
      id: this.currentTraceId++,
      caseNumber: "2024-002",
      userId: adminUser.id,
      cryptoType: "Ethereum (ETH)",
      walletAddress: "0x742d35Cc6251F6426C72",
      victimName: "Jane Smith",
      incidentDate: new Date("2024-01-10"),
      description: "Smart contract exploitation",
      status: "completed",
      isPremium: true,
      paymentIntentId: "pi_test123",
      results: { 
        totalTransactions: 45,
        totalValue: "15.5 ETH",
        suspiciousAddresses: 3,
        riskScore: "High"
      },
      reportUrl: "/reports/trace-2-report.pdf",
      estimatedCompletion: null,
      completedAt: new Date(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    };
    this.traces.set(sampleTrace2.id, sampleTrace2);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTrace(id: number): Promise<Trace | undefined> {
    return this.traces.get(id);
  }

  async getTracesByUser(userId: number): Promise<Trace[]> {
    return Array.from(this.traces.values()).filter(trace => trace.userId === userId);
  }

  async getAllTraces(): Promise<Trace[]> {
    return Array.from(this.traces.values());
  }

  async createTrace(insertTrace: InsertTrace): Promise<Trace> {
    const trace: Trace = {
      ...insertTrace,
      id: this.currentTraceId++,
      createdAt: new Date(),
      completedAt: null,
      results: null,
      reportUrl: null,
    };
    this.traces.set(trace.id, trace);
    return trace;
  }

  async updateTrace(id: number, updates: Partial<Trace>): Promise<Trace | undefined> {
    const trace = this.traces.get(id);
    if (!trace) return undefined;
    
    const updatedTrace = { ...trace, ...updates };
    this.traces.set(id, updatedTrace);
    return updatedTrace;
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async getDepartmentByApiKey(apiKey: string): Promise<Department | undefined> {
    return Array.from(this.departments.values()).find(dept => dept.apiKey === apiKey);
  }

  async createDepartment(insertDept: InsertDepartment): Promise<Department> {
    const department: Department = {
      ...insertDept,
      id: this.currentDeptId++,
      apiKey: crypto.randomBytes(32).toString('hex'),
      createdAt: new Date(),
    };
    this.departments.set(department.id, department);
    return department;
  }

  async createPaymentRecord(insertPayment: InsertPaymentRecord): Promise<PaymentRecord> {
    const payment: PaymentRecord = {
      ...insertPayment,
      id: this.currentPaymentId++,
      createdAt: new Date(),
    };
    this.paymentRecords.set(payment.id, payment);
    return payment;
  }

  async getPaymentByTraceId(traceId: number): Promise<PaymentRecord | undefined> {
    return Array.from(this.paymentRecords.values()).find(payment => payment.traceId === traceId);
  }

  async createSignupToken(email: string, departmentId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    this.signupTokens.set(token, { email, departmentId, expires });
    return token;
  }

  async validateSignupToken(token: string): Promise<{ email: string; departmentId: number } | null> {
    const tokenData = this.signupTokens.get(token);
    if (!tokenData) return null;
    
    if (tokenData.expires < new Date()) {
      this.signupTokens.delete(token);
      return null;
    }
    
    return { email: tokenData.email, departmentId: tokenData.departmentId };
  }
}

export const storage = new MemStorage();
