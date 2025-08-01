import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface CaseAnalysis {
  summary: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendations: string[];
  suspiciousPatterns: string[];
  confidence: number;
}

export interface TransactionAnalysis {
  description: string;
  riskScore: number;
  flags: string[];
  nextSteps: string[];
}

export interface Transaction {
  from: string;
  to: string;
  amount: string;
  currency: string;
  timestamp: string;
}

/**
 * Hook for analyzing cryptocurrency cases with AI
 */
export function useAnalyzeCryptoCase() {
  return useMutation({
    mutationFn: async (data: {
      caseDetails: string;
      transactionData?: string;
      addresses?: string[];
    }) => {
      const response = await fetch("/api/ai/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze case");
      }
      
      const result = await response.json();
      return result.analysis as CaseAnalysis;
    }
  });
}

/**
 * Hook for analyzing transaction patterns
 */
export function useAnalyzeTransactions() {
  return useMutation({
    mutationFn: async (transactions: Transaction[]) => {
      const response = await fetch("/api/ai/analyze-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions })
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze transactions");
      }
      
      const result = await response.json();
      return result.analysis as TransactionAnalysis;
    }
  });
}

/**
 * Hook for generating AI report summaries
 */
export function useGenerateReport() {
  return useMutation({
    mutationFn: async (data: {
      caseData: { id: string; status: string };
      findings: string[];
    }) => {
      const response = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      
      const result = await response.json();
      return result.summary as string;
    }
  });
}

/**
 * Hook for getting AI investigation suggestions
 */
export function useGetInvestigationSuggestions() {
  return useMutation({
    mutationFn: async (data: {
      caseType: string;
      currentEvidence: string[];
    }) => {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to get suggestions");
      }
      
      const result = await response.json();
      return result.suggestions as string[];
    }
  });
}

/**
 * Hook for checking AI integration status
 */
export function useAIStatus() {
  return useQuery({
    queryKey: ["/api/ai/status"],
    queryFn: async () => {
      const response = await fetch("/api/ai/status");
      
      if (!response.ok) {
        throw new Error("Failed to check AI status");
      }
      
      return response.json();
    }
  });
}