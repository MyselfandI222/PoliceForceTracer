import { Router } from "express";
import { z } from "zod";
import { 
  analyzeCryptoCase, 
  generateReportSummary, 
  analyzeTransactionPattern,
  getInvestigationSuggestions 
} from "../lib/openai";

const router = Router();

// Schema for case analysis request
const caseAnalysisSchema = z.object({
  caseDetails: z.string().min(10, "Case details must be at least 10 characters"),
  transactionData: z.string().optional().default(""),
  addresses: z.array(z.string()).default([])
});

// Schema for transaction analysis
const transactionAnalysisSchema = z.object({
  transactions: z.array(z.object({
    from: z.string(),
    to: z.string(),
    amount: z.string(),
    currency: z.string(),
    timestamp: z.string()
  }))
});

// Schema for report generation
const reportGenerationSchema = z.object({
  caseData: z.object({
    id: z.string(),
    status: z.string()
  }),
  findings: z.array(z.string())
});

// Schema for investigation suggestions
const suggestionsSchema = z.object({
  caseType: z.string(),
  currentEvidence: z.array(z.string())
});

/**
 * POST /api/ai/analyze-case
 * Analyze a cryptocurrency case using AI
 */
router.post("/analyze-case", async (req, res) => {
  try {
    const { caseDetails, transactionData, addresses } = caseAnalysisSchema.parse(req.body);
    
    const analysis = await analyzeCryptoCase(caseDetails, transactionData, addresses);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error("Case analysis error:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Analysis failed"
    });
  }
});

/**
 * POST /api/ai/analyze-transactions
 * Analyze transaction patterns for suspicious activity
 */
router.post("/analyze-transactions", async (req, res) => {
  try {
    const { transactions } = transactionAnalysisSchema.parse(req.body);
    
    const analysis = await analyzeTransactionPattern(transactions);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error("Transaction analysis error:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Transaction analysis failed"
    });
  }
});

/**
 * POST /api/ai/generate-report
 * Generate an AI-powered investigation report summary
 */
router.post("/generate-report", async (req, res) => {
  try {
    const { caseData, findings } = reportGenerationSchema.parse(req.body);
    
    const summary = await generateReportSummary(caseData, findings);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Report generation failed"
    });
  }
});

/**
 * POST /api/ai/suggestions
 * Get AI-powered investigation suggestions
 */
router.post("/suggestions", async (req, res) => {
  try {
    const { caseType, currentEvidence } = suggestionsSchema.parse(req.body);
    
    const suggestions = await getInvestigationSuggestions(caseType, currentEvidence);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get suggestions"
    });
  }
});

/**
 * GET /api/ai/status
 * Check if OpenAI integration is working
 */
router.get("/status", (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  res.json({
    success: true,
    status: hasApiKey ? "ready" : "missing_api_key",
    message: hasApiKey 
      ? "OpenAI integration is ready" 
      : "OpenAI API key required for AI features"
  });
});

export default router;