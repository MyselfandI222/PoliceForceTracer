import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here"
});

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

/**
 * Analyze a cryptocurrency investigation case using AI
 */
export async function analyzeCryptoCase(
  caseDetails: string,
  transactionData: string,
  addresses: string[]
): Promise<CaseAnalysis> {
  try {
    const prompt = `You are an expert cryptocurrency investigation analyst for law enforcement. Analyze this case:

Case Details: ${caseDetails}
Transaction Data: ${transactionData}
Addresses Involved: ${addresses.join(", ")}

Provide a comprehensive analysis in JSON format with:
- summary: Brief overview of the case
- riskLevel: LOW, MEDIUM, HIGH, or CRITICAL
- recommendations: Array of actionable recommendations
- suspiciousPatterns: Array of suspicious patterns identified
- confidence: Confidence score between 0 and 1

Focus on actionable intelligence for law enforcement officers.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a cryptocurrency investigation expert assisting law enforcement. Provide detailed, actionable analysis in valid JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Analysis unavailable",
      riskLevel: result.riskLevel || "MEDIUM",
      recommendations: result.recommendations || [],
      suspiciousPatterns: result.suspiciousPatterns || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze case with AI");
  }
}

/**
 * Generate an investigation report summary
 */
export async function generateReportSummary(
  caseData: any,
  findings: string[]
): Promise<string> {
  try {
    const prompt = `Generate a professional investigation report summary for this cryptocurrency case:

Case ID: ${caseData.id}
Status: ${caseData.status}
Key Findings: ${findings.join(", ")}

Create a concise, professional summary suitable for law enforcement reports.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional report writer for law enforcement cryptocurrency investigations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

    return response.choices[0].message.content || "Report summary unavailable";
  } catch (error) {
    console.error("Report generation error:", error);
    throw new Error("Failed to generate report summary");
  }
}

/**
 * Analyze transaction patterns for suspicious activity
 */
export async function analyzeTransactionPattern(
  transactions: any[]
): Promise<TransactionAnalysis> {
  try {
    const transactionSummary = transactions.map(tx => 
      `${tx.from} -> ${tx.to}: ${tx.amount} ${tx.currency} at ${tx.timestamp}`
    ).join("\n");

    const prompt = `Analyze these cryptocurrency transactions for suspicious patterns:

${transactionSummary}

Provide analysis in JSON format with:
- description: What you observe in the transactions
- riskScore: Score from 0-100 (higher = more suspicious)
- flags: Array of specific suspicious indicators
- nextSteps: Recommended investigation steps`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a blockchain analysis expert. Identify suspicious transaction patterns and provide actionable intelligence."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      description: result.description || "No analysis available",
      riskScore: Math.max(0, Math.min(100, result.riskScore || 0)),
      flags: result.flags || [],
      nextSteps: result.nextSteps || []
    };
  } catch (error) {
    console.error("Transaction analysis error:", error);
    throw new Error("Failed to analyze transactions");
  }
}

/**
 * Get AI-powered investigation suggestions
 */
export async function getInvestigationSuggestions(
  caseType: string,
  currentEvidence: string[]
): Promise<string[]> {
  try {
    const prompt = `As a cryptocurrency investigation expert, suggest next steps for this ${caseType} case.

Current Evidence: ${currentEvidence.join(", ")}

Provide 3-5 specific, actionable investigation steps in JSON format as an array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert cryptocurrency investigator. Provide specific, actionable investigation steps in JSON array format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.suggestions || result.steps || [];
  } catch (error) {
    console.error("Suggestions error:", error);
    return ["Review transaction history", "Check for known addresses", "Analyze timing patterns"];
  }
}