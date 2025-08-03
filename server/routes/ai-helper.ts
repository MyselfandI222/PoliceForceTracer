import OpenAI from "openai";
import type { Request, Response } from "express";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Comprehensive knowledge base about CryptoTrace platform
const getCryptoTraceKnowledgeBase = () => {
  return `
# CryptoTrace Platform Knowledge Base

## Platform Overview
CryptoTrace is a sophisticated cryptocurrency investigation platform designed for law enforcement agencies and victims of crypto-related crimes. The platform enables collaborative investigation, tracing, and resolution of cryptocurrency theft and fraud cases.

## Core Features & Capabilities

### 1. Multi-Portal Architecture
- **Law Enforcement Portal**: For officers to manage cases, conduct investigations, and coordinate with victims
- **Victim Portal**: For crime victims to submit cases, track progress, and choose recovery options
- **Admin Portal**: For department administrators to manage officers, settings, and system configuration

### 2. Role-Based Access Control
- **Officers**: Badge-based authentication, case management, trace submission and review
- **Admins**: Officer management, department settings, premium service oversight
- **Super Admins**: System-wide configuration, multi-department management
- **Victims**: Case submission, status tracking, recovery option selection

### 3. Cryptocurrency Tracing System
- **Free Traces**: Processed automatically every Wednesday at 11:59 PM
- **Premium Traces**: Expedited processing within 1-2 hours for $995
- **Multi-blockchain Support**: Bitcoin, Ethereum, and other major cryptocurrencies
- **Advanced Analytics**: Pattern recognition, suspicious activity detection, cross-chain tracking

### 4. AI-Powered Investigation Tools
- **Case Analysis**: Automated risk assessment and suspicious pattern detection
- **Pattern Recognition**: Machine learning algorithms to identify money laundering indicators
- **Investigation Recommendations**: AI-suggested next steps and investigative leads
- **Report Generation**: Professional summaries suitable for legal proceedings

### 5. Victim Recovery Options
After trace completion, victims can choose:
- **Punish Scammers**: Submit to law enforcement for criminal prosecution
- **Retrieve Money**: Professional asset recovery through Asset Reality partnership
- **Capital Loss Claims**: Tax recovery assistance via Canada Revenue Agency
- **Combined Approach**: Pursue both criminal and civil recovery simultaneously

## Navigation & User Interface

### Main Navigation Areas
1. **Dashboard**: Overview of cases, recent activity, quick actions
2. **AI Assistant**: Advanced case analysis and investigation tools
3. **Live Demo**: Platform demonstration and testing features
4. **Active Traces**: Current investigations and trace status
5. **Case Files**: Historical cases and documentation
6. **Reports**: Generated investigation reports and analytics
7. **Settings**: User profile, preferences, and department configuration

### Key Workflows
1. **Trace Submission**: Address input → Case details → Processing choice (free/premium)
2. **Case Management**: Officer assignment → Investigation → Report generation → Victim coordination
3. **Recovery Process**: Trace completion → Option selection → Service coordination

## Technical Architecture
- **Frontend**: React 18 with TypeScript, Shadcn/UI components, Tailwind CSS
- **Backend**: Express.js with PostgreSQL database via Drizzle ORM
- **Authentication**: JWT-based with bcrypt encryption
- **Payment Processing**: Stripe integration for premium services
- **AI Integration**: OpenAI GPT-4o for case analysis and assistance

## Pricing & Service Tiers
- **Free Traces**: No cost, weekly batch processing
- **Premium Traces**: $995, 1-2 hour processing with advanced analytics
- **Department Licenses**: Custom pricing for large law enforcement agencies
- **Recovery Services**: Commission-based through Asset Reality partnership

## Security & Compliance
- Badge-based officer authentication
- Encrypted data transmission and storage
- Audit trails for all investigations
- GDPR and law enforcement compliance standards
- Secure inter-departmental communication

## Support & Training
- Contextual AI assistance for all platform features
- Department onboarding and officer training
- 24/7 technical support for premium customers
- Documentation and best practices guides

## Test Credentials (Development)
- **Officer Login**: Badge 12345, Password: officer123
- **Admin Login**: Badge 67890, Password: admin123
- **Victim Portal**: Standard email/password authentication

This platform represents the cutting edge of cryptocurrency investigation technology, combining advanced blockchain analysis with AI-powered insights to help law enforcement and victims recover stolen assets and prosecute crypto criminals effectively.
`;
};

// System prompt that gives GPT-4o comprehensive context about CryptoTrace
const getSystemPrompt = (currentPage: string, userRole: string) => {
  return `You are the CryptoTrace AI Assistant, an expert helper for the CryptoTrace cryptocurrency investigation platform. You have comprehensive knowledge about the platform and should provide helpful, accurate, and contextual assistance.

CURRENT CONTEXT:
- User Role: ${userRole}
- Current Page: ${currentPage}
- Platform: CryptoTrace - Law Enforcement Cryptocurrency Investigation Platform

KNOWLEDGE BASE:
${getCryptoTraceKnowledgeBase()}

BEHAVIOR GUIDELINES:
1. Provide accurate, helpful responses based on the platform's actual features and capabilities
2. Be professional and supportive, understanding users may be dealing with serious crimes
3. Offer specific, actionable guidance rather than generic help
4. Reference exact features, prices, and workflows from the knowledge base
5. Suggest relevant platform features based on user questions
6. Maintain appropriate tone for law enforcement and victim users
7. If asked about features not in the knowledge base, acknowledge limitations honestly
8. Guide users to appropriate platform sections for their needs
9. Provide step-by-step instructions when helpful
10. Consider the user's current page context when providing relevant suggestions

Remember: You are representing a real platform that helps solve cryptocurrency crimes. Be knowledgeable, helpful, and appropriately serious about the important work being done.`;
};

export const handleAIHelperChat = async (req: Request, res: Response) => {
  try {
    const { messages, currentPage = 'dashboard', userRole = 'officer' } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'AI service unavailable - OpenAI API key not configured' 
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages array is required' 
      });
    }

    // Prepare messages for OpenAI with system context
    const openaiMessages: ChatMessage[] = [
      {
        role: 'system',
        content: getSystemPrompt(currentPage, userRole)
      },
      ...messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: openaiMessages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated from AI');
    }

    res.json({
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('AI Helper chat error:', error);
    
    // Provide helpful error messages
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable - quota exceeded' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(503).json({ 
        error: 'AI service configuration error - invalid API key' 
      });
    }

    res.status(500).json({ 
      error: 'AI service error - please try again or contact support' 
    });
  }
};