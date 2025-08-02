import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  badgeNumber: text("badge_number").notNull(),
  role: text("role").notNull().default("officer"), // "officer", "admin", "super_admin"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const traces = pgTable("traces", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  cryptoType: text("crypto_type").notNull(),
  walletAddress: text("wallet_address").notNull(),
  victimName: text("victim_name").notNull(),
  incidentDate: timestamp("incident_date").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("submitted"), // "submitted", "queued", "processing", "completed", "failed"
  isPremium: boolean("is_premium").notNull().default(false),
  submittedBy: text("submitted_by").notNull().default("victim"), // "officer", "victim"
  paymentIntentId: text("payment_intent_id"),
  results: jsonb("results"),
  reportUrl: text("report_url"),
  estimatedCompletion: timestamp("estimated_completion"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  contactEmail: text("contact_email").notNull(),
  apiKey: text("api_key").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  monthlyBudget: decimal("monthly_budget", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentRecords = pgTable("payment_records", {
  id: serial("id").primaryKey(),
  traceId: integer("trace_id").notNull().references(() => traces.id),
  userId: integer("user_id").notNull().references(() => users.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  amount: integer("amount").notNull(), // in cents
  status: text("status").notNull(), // "pending", "succeeded", "failed"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Victim-Officer Assignment table for direct police submissions
export const victimOfficerAssignments = pgTable("victim_officer_assignments", {
  id: serial("id").primaryKey(),
  victimId: integer("victim_id").notNull().references(() => users.id),
  officerId: integer("officer_id").notNull().references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  assignedBy: text("assigned_by").notNull().default("victim_request"), // How the assignment was made
  isActive: boolean("is_active").notNull().default(true),
});

// Police case submissions from victims
export const policeCaseSubmissions = pgTable("police_case_submissions", {
  id: serial("id").primaryKey(),
  victimId: integer("victim_id").notNull().references(() => users.id),
  officerId: integer("officer_id").notNull().references(() => users.id),
  originalTraceId: text("original_trace_id").notNull(),
  actionType: text("action_type").notNull(), // "prosecute", etc.
  reason: text("reason").notNull(),
  recoveryAmount: text("recovery_amount"),
  riskLevel: text("risk_level"),
  status: text("status").notNull().default("submitted"), // "submitted", "under_review", "accepted", "rejected"
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  officerNotes: text("officer_notes"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTraceSchema = createInsertSchema(traces).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  results: true,
  reportUrl: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
  apiKey: true,
});

export const insertVictimOfficerAssignmentSchema = createInsertSchema(victimOfficerAssignments).omit({
  id: true,
  assignedAt: true,
});

export const insertPoliceCaseSubmissionSchema = createInsertSchema(policeCaseSubmissions).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertPaymentRecordSchema = createInsertSchema(paymentRecords).omit({
  id: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Signup schema
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  department: z.string().min(1),
  badgeNumber: z.string().min(1),
  signupToken: z.string().min(1),
});

// Police intake webhook schema
export const policeIntakeSchema = z.object({
  officers: z.array(z.object({
    email: z.string().email(),
    name: z.string(),
    badgeNumber: z.string(),
    department: z.string(),
  })),
  victims: z.array(z.object({
    name: z.string(),
    email: z.string().email().optional(),
    caseNumber: z.string(),
    incidentDate: z.string(),
    cryptoAddress: z.string(),
    cryptoType: z.string(),
    description: z.string(),
  })),
  apiKey: z.string(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Trace = typeof traces.$inferSelect;
export type InsertTrace = z.infer<typeof insertTraceSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type PaymentRecord = typeof paymentRecords.$inferSelect;
export type InsertPaymentRecord = z.infer<typeof insertPaymentRecordSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupRequest = z.infer<typeof signupSchema>;
export type PoliceIntakeRequest = z.infer<typeof policeIntakeSchema>;
