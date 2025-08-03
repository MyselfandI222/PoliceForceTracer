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

// Intelligent fallback response system when OpenAI is unavailable
const getIntelligentFallbackResponse = (userMessage: string, currentPage: string, userRole: string): string => {
  const message = userMessage.toLowerCase();
  
  // Navigation help
  if (message.includes('navigate') || message.includes('find') || message.includes('where') || message.includes('how to')) {
    return `I can help you navigate CryptoTrace! Here are the main sections:\n\n• **Dashboard** - Overview of all cases and recent activity\n• **AI Assistant** - Advanced case analysis and pattern detection\n• **Active Traces** - Current investigations and trace status\n• **Case Files** - Historical cases and documentation\n• **Reports** - Generated investigation reports\n• **Settings** - User profile and preferences\n\nYou're currently on the ${currentPage} page. What specific feature would you like to find?`;
  }

  // Trace-related questions
  if (message.includes('trace') || message.includes('submit') || message.includes('investigation') || message.includes('bitcoin') || message.includes('ethereum') || message.includes('crypto')) {
    return `For cryptocurrency traces:\n\n**Free Traces:** Processed automatically every Wednesday at 11:59 PM\n**Premium Traces:** Processed within 1-2 hours for $995\n\n**To submit a trace:**\n1. Navigate to the trace submission form\n2. Enter the wallet address and cryptocurrency type\n3. Provide case details and description\n4. Choose free or premium processing\n5. Submit and track progress\n\nSupported cryptocurrencies: Bitcoin, Ethereum, and other major blockchains. Need help with a specific trace?`;
  }

  // AI Assistant help
  if (message.includes('ai') || message.includes('analysis') || message.includes('pattern') || message.includes('assistant')) {
    return `The AI Assistant provides powerful investigation tools:\n\n• **Case Analysis** - Risk assessment and suspicious activity detection\n• **Pattern Recognition** - Identify money laundering and fraud indicators\n• **Investigation Recommendations** - AI-suggested next steps and leads\n• **Report Generation** - Professional summaries for legal proceedings\n• **Cross-chain Analysis** - Multi-blockchain investigation insights\n\nAccess these tools from the AI Assistant page in the sidebar. What type of analysis do you need help with?`;
  }

  // Recovery and post-trace help
  if (message.includes('recovery') || message.includes('money') || message.includes('asset') || message.includes('victim')) {
    return `After a trace completes, victims have two main recovery options:\n\n**1. Punish Scammers**\n• Submit case to law enforcement\n• Pursue criminal prosecution\n• Asset freezing and legal action\n\n**2. Retrieve Money**\n• Professional recovery through Asset Reality\n• Capital loss claims via Canada Revenue Agency\n• Both options can be pursued simultaneously\n\nRecovery services are provided through our partnerships. Which recovery path interests you most?`;
  }

  // Premium features
  if (message.includes('premium') || message.includes('upgrade') || message.includes('instant') || message.includes('price') || message.includes('cost')) {
    return `Premium features include:\n\n• **Instant Processing** - 1-2 hour trace completion\n• **Advanced Analytics** - Detailed blockchain analysis\n• **Priority Support** - Dedicated investigator assignment\n• **Real-time Updates** - Live status notifications\n• **Cross-chain Tracking** - Multi-blockchain investigations\n\nPremium traces cost $995 and can be upgraded at any time. Payment is processed securely through Stripe. Would you like to know more about upgrading?`;
  }

  // Login and access help
  if (message.includes('login') || message.includes('access') || message.includes('password') || message.includes('badge')) {
    return `For login assistance:\n\n**Test Credentials Available:**\n• Officer: Badge 12345, Password: officer123\n• Admin: Badge 67890, Password: admin123\n• Victim: Standard email/password authentication\n\n**Authentication Issues?**\n• Contact your department administrator\n• Use the password reset feature\n• Ensure your badge number is entered correctly\n\nNeed help with a specific login issue?`;
  }

  // Role-specific welcome based on current context
  const roleContext = {
    'officer': "As a law enforcement officer, you can manage cases, submit traces, and coordinate with victims through this platform.",
    'admin': "As an administrator, you can manage officers, oversee department settings, and monitor premium services.",
    'victim': "As a victim, you can track your case progress and choose recovery options after trace completion."
  };

  const pageContext = {
    'dashboard': "On the dashboard, you can view case summaries, recent activity, and quick actions.",
    'ai-assistant': "The AI Assistant provides advanced case analysis and investigation insights.",
    'traces': "Here you can view and manage all active cryptocurrency traces.",
    'cases': "This section contains historical cases and documentation.",
    'reports': "Access generated investigation reports and analytics here.",
    'settings': "Manage your profile, preferences, and system configuration."
  };

  return `Hello! I'm your CryptoTrace AI assistant. ${roleContext[userRole as keyof typeof roleContext] || roleContext.officer}\n\n${pageContext[currentPage as keyof typeof pageContext] || "I'm here to help you navigate the platform."}\n\nI can assist you with:\n• Navigation and feature guidance\n• Cryptocurrency investigation procedures\n• Case management workflows\n• Recovery options and next steps\n• Platform settings and configuration\n\nWhat specific help do you need today?`;
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
    
    // Get the last user message for intelligent fallback
    const lastUserMessage = messages.filter((msg: any) => msg.role === 'user').pop();
    const userMessage = lastUserMessage?.content || '';
    
    // Provide intelligent fallback response when OpenAI is unavailable
    const fallbackResponse = getIntelligentFallbackResponse(userMessage, currentPage, userRole);
    
    // Add context about the service limitation
    let serviceNote = '';
    if (error.code === 'insufficient_quota') {
      serviceNote = '\n\n*Note: The advanced AI service is currently unavailable due to quota limits. Please contact your administrator to upgrade the OpenAI plan for enhanced AI capabilities.*';
    } else if (error.code === 'invalid_api_key') {
      serviceNote = '\n\n*Note: The AI service requires configuration. Please contact your administrator to set up the OpenAI API key.*';
    } else {
      serviceNote = '\n\n*Note: The advanced AI service is temporarily unavailable. I\'m providing assistance using the built-in knowledge base.*';
    }
    
    // Return intelligent response instead of error
    res.json({
      message: fallbackResponse + serviceNote,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
};