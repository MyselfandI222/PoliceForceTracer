import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, User, Send, Minimize2, Maximize2, HelpCircle, MessageSquare, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIHelperProps {
  currentPage?: string;
  userRole?: string;
}

export default function AIHelper({ currentPage = "dashboard", userRole = "officer" }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when component mounts
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [currentPage, userRole]);

  const getWelcomeMessage = () => {
    const roleSpecificGreeting = {
      'officer': "Hello! I'm your CryptoTrace AI assistant. I can help you navigate cryptocurrency investigations, understand trace reports, use the AI analysis tools, and manage cases efficiently.",
      'admin': "Welcome! I'm here to help you manage the CryptoTrace platform. I can assist with officer management, system settings, premium services, and administrative tasks.",
      'victim': "Hi there! I'm your guide for the CryptoTrace victim portal. I can help you understand your case status, post-trace options, recovery processes, and next steps."
    };

    const pageSpecificTips = {
      'dashboard': "You're on the main dashboard. Here you can view case summaries, recent activity, and quick actions.",
      'ai-assistant': "You're using the AI Assistant for case analysis. This tool can help analyze cryptocurrency patterns and provide investigation insights.",
      'victim-portal': "You're in the victim portal where you can track your cases and choose post-trace actions.",
      'admin-settings': "You're in the admin settings area where you can manage officers, departments, and system configuration."
    };

    return `${roleSpecificGreeting[userRole as keyof typeof roleSpecificGreeting] || roleSpecificGreeting.officer}\n\n${pageSpecificTips[currentPage as keyof typeof pageSpecificTips] || "How can I help you today?"}\n\nYou can ask me about:\n• How to submit or track cryptocurrency traces\n• Understanding investigation reports\n• Using premium features\n• Post-trace recovery options\n• System navigation and features`;
  };

  const getContextualResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Navigation help
    if (message.includes('navigate') || message.includes('find') || message.includes('where')) {
      return "I can help you navigate CryptoTrace! Here are the main sections:\n\n• **Dashboard** - Overview of all cases and recent activity\n• **AI Assistant** - Advanced case analysis and pattern detection\n• **Trace Management** - Submit and track cryptocurrency investigations\n• **Settings** - Manage your profile and preferences\n\nWhat specific area would you like to explore?";
    }

    // Trace-related questions
    if (message.includes('trace') || message.includes('submit') || message.includes('investigation')) {
      return "For cryptocurrency traces:\n\n**Free Traces:** Processed automatically every Wednesday at 11:59 PM\n**Premium Traces:** Processed within 1-2 hours for $995\n\nTo submit a trace:\n1. Go to the trace submission form\n2. Enter the wallet address\n3. Provide case details and description\n4. Choose free or premium processing\n\nNeed help with a specific trace?";
    }

    // AI Assistant help
    if (message.includes('ai') || message.includes('analysis') || message.includes('pattern')) {
      return "The AI Assistant can help with:\n\n• **Case Analysis** - Risk assessment and suspicious activity detection\n• **Pattern Recognition** - Identify money laundering and fraud indicators\n• **Investigation Recommendations** - Suggested next steps and leads\n• **Report Generation** - Professional summaries for legal proceedings\n\nWhat type of analysis do you need help with?";
    }

    // Recovery and post-trace help
    if (message.includes('recovery') || message.includes('money') || message.includes('asset reality')) {
      return "After a trace completes, victims have two main options:\n\n**1. Punish Scammers**\n• Submit case to law enforcement\n• Pursue criminal prosecution\n• Asset freezing and legal action\n\n**2. Retrieve Money**\n• Professional recovery through Asset Reality\n• Capital loss claims via Canada Revenue Agency\n• Both options can be pursued simultaneously\n\nWhich recovery path interests you most?";
    }

    // Premium features
    if (message.includes('premium') || message.includes('upgrade') || message.includes('instant')) {
      return "Premium features include:\n\n• **Instant Processing** - 1-2 hour trace completion\n• **Advanced Analytics** - Detailed blockchain analysis\n• **Priority Support** - Dedicated investigator assignment\n• **Real-time Updates** - Live status notifications\n• **Cross-chain Tracking** - Multi-blockchain investigations\n\nPremium traces cost $995 and can be upgraded at any time. Would you like to know more about upgrading?";
    }

    // Login and access help
    if (message.includes('login') || message.includes('access') || message.includes('password')) {
      return "For login assistance:\n\n**Test Credentials Available:**\n• Officer: badge 12345, password 'officer123'\n• Admin: badge 67890, password 'admin123'\n• Victim: Use victim login with test credentials\n\n**Forgot Password?**\nContact your department administrator or use the password reset feature.\n\nNeed help with a specific login issue?";
    }

    // General help
    return "I understand you need assistance! Here are some things I can help you with:\n\n• **Navigation** - Finding features and pages\n• **Trace Submission** - Step-by-step guidance\n• **Case Management** - Tracking and updates\n• **AI Analysis** - Using investigation tools\n• **Recovery Options** - Post-trace actions\n• **Premium Features** - Upgrading and benefits\n\nCould you be more specific about what you'd like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: getContextualResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    }]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-xl border-2 border-blue-200 ${isMinimized ? 'h-16' : 'h-[500px]'} transition-all duration-300`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">CryptoTrace AI Helper</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  Online
                </Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
            <div className="px-4 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-xs"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                New Chat
              </Button>
            </div>
            
            <Separator />
            
            <ScrollArea className="flex-1 px-4 py-3">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 opacity-70 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about CryptoTrace..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}