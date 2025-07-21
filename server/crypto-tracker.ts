interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  blockHeight: number;
  confirmations: number;
  fee: number;
}

interface AddressInfo {
  address: string;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  firstSeen: Date;
  lastSeen: Date;
  riskScore: number;
  tags: string[];
  cluster?: string;
}

interface TraceResult {
  targetAddress: string;
  cryptocurrency: string;
  totalValue: number;
  riskAssessment: string;
  summary: string;
  transactions: Transaction[];
  connectedAddresses: AddressInfo[];
  flowAnalysis: {
    incomingValue: number;
    outgoingValue: number;
    netFlow: number;
    majorRecipients: Array<{ address: string; amount: number; percentage: number }>;
    timePattern: string;
  };
  riskFactors: Array<{ factor: string; severity: "low" | "medium" | "high"; description: string }>;
  recommendations: string[];
  reportId: string;
  generatedAt: Date;
}

export class CryptoTracker {
  private knownAddresses = new Map<string, AddressInfo>();
  private exchangeAddresses = new Set([
    "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", // BitFinex
    "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be", // Binance
    "0x28c6c06298d514db089934071355e5743bf21d60", // Binance 2
    "0xd24400ae8bfebb18ca49be86258a3c749cf46853", // Binance 3
  ]);
  
  private knownRiskyAddresses = new Set([
    "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", // BitFinex hack
    "15gHNr4TCKmhHDEG31L2XFNvpnEcnPSQvd", // Silk Road
  ]);

  constructor() {
    this.initializeKnownAddresses();
  }

  private initializeKnownAddresses() {
    // Satoshi's Genesis Address
    this.knownAddresses.set("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", {
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      balance: 50.0,
      totalReceived: 68.71,
      totalSent: 18.71,
      transactionCount: 387,
      firstSeen: new Date("2009-01-03"),
      lastSeen: new Date("2024-07-15"),
      riskScore: 0.1,
      tags: ["genesis", "satoshi", "historical"],
      cluster: "satoshi-cluster"
    });

    // BitFinex Hack Address
    this.knownAddresses.set("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", {
      address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
      balance: 0.0,
      totalReceived: 119756.0,
      totalSent: 119756.0,
      transactionCount: 2847,
      firstSeen: new Date("2016-08-02"),
      lastSeen: new Date("2022-02-01"),
      riskScore: 0.95,
      tags: ["exchange-hack", "stolen-funds", "bitfinex"],
      cluster: "bitfinex-hack-cluster"
    });

    // Ethereum Foundation
    this.knownAddresses.set("0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae", {
      address: "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
      balance: 345892.12,
      totalReceived: 12500000.0,
      totalSent: 11154107.88,
      transactionCount: 8943,
      firstSeen: new Date("2015-07-30"),
      lastSeen: new Date("2024-07-20"),
      riskScore: 0.05,
      tags: ["ethereum-foundation", "legitimate", "developer-funds"],
      cluster: "ethereum-foundation-cluster"
    });

    // Binance Hot Wallet
    this.knownAddresses.set("0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be", {
      address: "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
      balance: 248756.89,
      totalReceived: 89500000.0,
      totalSent: 89251243.11,
      transactionCount: 156789,
      firstSeen: new Date("2017-07-14"),
      lastSeen: new Date("2024-07-21"),
      riskScore: 0.15,
      tags: ["binance", "exchange", "hot-wallet", "high-volume"],
      cluster: "binance-exchange-cluster"
    });
  }

  private generateRealisticTransactions(address: string, count: number): Transaction[] {
    const transactions: Transaction[] = [];
    const addressInfo = this.knownAddresses.get(address);
    
    if (!addressInfo) return transactions;

    for (let i = 0; i < count; i++) {
      const isIncoming = Math.random() > 0.5;
      const baseAmount = this.getRealisticAmount(address);
      const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const amount = baseAmount * (1 + variation);

      const daysAgo = Math.floor(Math.random() * 1095); // Last 3 years
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);

      transactions.push({
        hash: this.generateTransactionHash(),
        from: isIncoming ? this.getRandomAddress() : address,
        to: isIncoming ? address : this.getRandomAddress(),
        amount,
        timestamp,
        blockHeight: 800000 + Math.floor(Math.random() * 50000),
        confirmations: Math.floor(Math.random() * 1000) + 6,
        fee: amount * 0.001 // 0.1% fee
      });
    }

    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private getRealisticAmount(address: string): number {
    if (address.startsWith("0x")) {
      // Ethereum amounts (ETH)
      if (this.exchangeAddresses.has(address)) {
        return Math.random() * 1000 + 10; // 10-1010 ETH
      }
      return Math.random() * 50 + 0.1; // 0.1-50 ETH
    } else {
      // Bitcoin amounts (BTC)  
      if (this.exchangeAddresses.has(address)) {
        return Math.random() * 100 + 1; // 1-101 BTC
      }
      return Math.random() * 10 + 0.01; // 0.01-10 BTC
    }
  }

  private generateTransactionHash(): string {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  private getRandomAddress(): string {
    const knownAddressArray = Array.from(this.knownAddresses.keys());
    if (Math.random() < 0.3 && knownAddressArray.length > 0) {
      return knownAddressArray[Math.floor(Math.random() * knownAddressArray.length)];
    }
    
    // Generate random address
    if (Math.random() > 0.5) {
      // Bitcoin address
      return "1" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    } else {
      // Ethereum address
      return "0x" + Math.random().toString(16).substring(2, 15) + Math.random().toString(16).substring(2, 15);
    }
  }

  private calculateRiskScore(address: string, transactions: Transaction[]): number {
    let riskScore = 0;

    // Known risky address
    if (this.knownRiskyAddresses.has(address)) {
      riskScore += 0.8;
    }

    // High volume in short time
    const recentTransactions = transactions.filter(t => 
      Date.now() - t.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );
    if (recentTransactions.length > 100) {
      riskScore += 0.2;
    }

    // Large amounts
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    if (totalVolume > 10000) {
      riskScore += 0.15;
    }

    // Multiple small transactions (potential tumbling)
    const smallTransactions = transactions.filter(t => t.amount < 0.1);
    if (smallTransactions.length > transactions.length * 0.7) {
      riskScore += 0.25;
    }

    return Math.min(riskScore, 1.0);
  }

  private analyzeFlowPattern(transactions: Transaction[], targetAddress: string) {
    const incoming = transactions.filter(t => t.to === targetAddress);
    const outgoing = transactions.filter(t => t.from === targetAddress);
    
    const incomingValue = incoming.reduce((sum, t) => sum + t.amount, 0);
    const outgoingValue = outgoing.reduce((sum, t) => sum + t.amount, 0);
    
    const recipientMap = new Map<string, number>();
    outgoing.forEach(t => {
      recipientMap.set(t.to, (recipientMap.get(t.to) || 0) + t.amount);
    });

    const majorRecipients = Array.from(recipientMap.entries())
      .map(([address, amount]) => ({
        address,
        amount,
        percentage: (amount / outgoingValue) * 100
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Analyze time patterns
    const hourCounts = new Array(24).fill(0);
    transactions.forEach(t => {
      hourCounts[t.timestamp.getHours()]++;
    });
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const timePattern = peakHour < 6 || peakHour > 22 ? "night-heavy" : 
                      peakHour >= 9 && peakHour <= 17 ? "business-hours" : "mixed";

    return {
      incomingValue,
      outgoingValue,
      netFlow: incomingValue - outgoingValue,
      majorRecipients,
      timePattern
    };
  }

  public async traceAddress(address: string, cryptocurrency: string): Promise<TraceResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const addressInfo = this.knownAddresses.get(address) || this.generateAddressInfo(address);
    const transactions = this.generateRealisticTransactions(address, Math.min(50, addressInfo.transactionCount));
    const connectedAddresses = this.findConnectedAddresses(transactions, address);
    const flowAnalysis = this.analyzeFlowPattern(transactions, address);
    const riskScore = this.calculateRiskScore(address, transactions);

    const riskFactors = this.identifyRiskFactors(addressInfo, transactions, flowAnalysis);
    const recommendations = this.generateRecommendations(riskScore, riskFactors);

    const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const riskAssessment = riskScore > 0.7 ? "HIGH RISK" : 
                         riskScore > 0.4 ? "MEDIUM RISK" : "LOW RISK";

    const summary = this.generateSummary(addressInfo, totalValue, riskAssessment, transactions.length);

    return {
      targetAddress: address,
      cryptocurrency,
      totalValue,
      riskAssessment,
      summary,
      transactions,
      connectedAddresses,
      flowAnalysis,
      riskFactors,
      recommendations,
      reportId: `CR-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      generatedAt: new Date()
    };
  }

  private generateAddressInfo(address: string): AddressInfo {
    const isRisky = this.knownRiskyAddresses.has(address);
    const isExchange = this.exchangeAddresses.has(address);
    
    return {
      address,
      balance: Math.random() * (isExchange ? 10000 : 100),
      totalReceived: Math.random() * (isExchange ? 100000 : 1000),
      totalSent: Math.random() * (isExchange ? 99000 : 900),
      transactionCount: Math.floor(Math.random() * (isExchange ? 50000 : 500)) + 1,
      firstSeen: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      riskScore: isRisky ? 0.9 : (isExchange ? 0.2 : Math.random() * 0.5),
      tags: isRisky ? ["high-risk", "flagged"] : 
            isExchange ? ["exchange", "verified"] : 
            ["unknown"],
      cluster: `cluster-${Math.random().toString(36).substring(7)}`
    };
  }

  private findConnectedAddresses(transactions: Transaction[], targetAddress: string): AddressInfo[] {
    const connected = new Set<string>();
    
    transactions.forEach(t => {
      if (t.from !== targetAddress) connected.add(t.from);
      if (t.to !== targetAddress) connected.add(t.to);
    });

    return Array.from(connected).slice(0, 10).map(addr => 
      this.knownAddresses.get(addr) || this.generateAddressInfo(addr)
    );
  }

  private identifyRiskFactors(addressInfo: AddressInfo, transactions: Transaction[], flowAnalysis: any) {
    const factors = [];

    if (addressInfo.riskScore > 0.7) {
      factors.push({
        factor: "Known High-Risk Address",
        severity: "high" as const,
        description: "Address appears in known risk databases or sanctions lists"
      });
    }

    if (flowAnalysis.timePattern === "night-heavy") {
      factors.push({
        factor: "Unusual Transaction Timing",
        severity: "medium" as const,
        description: "High activity during unusual hours (potential automation)"
      });
    }

    if (transactions.length > 1000) {
      factors.push({
        factor: "High Transaction Volume",
        severity: "medium" as const,
        description: "Unusually high number of transactions may indicate mixing activity"
      });
    }

    const avgAmount = transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
    if (avgAmount < 0.1) {
      factors.push({
        factor: "Micro-transactions Pattern",
        severity: "medium" as const,
        description: "Many small transactions may indicate tumbling or obfuscation"
      });
    }

    return factors;
  }

  private generateRecommendations(riskScore: number, riskFactors: any[]): string[] {
    const recommendations = [];

    if (riskScore > 0.7) {
      recommendations.push("Immediate investigation recommended - high risk indicators present");
      recommendations.push("Consider freezing associated accounts pending investigation");
    }

    if (riskFactors.some(f => f.factor.includes("High Transaction Volume"))) {
      recommendations.push("Analyze transaction patterns for potential mixing services");
      recommendations.push("Cross-reference with known tumbling addresses");
    }

    if (riskFactors.some(f => f.factor.includes("Unusual Transaction Timing"))) {
      recommendations.push("Investigate automated trading or bot activity");
    }

    recommendations.push("Monitor address for future activity");
    recommendations.push("Correlate with other intelligence sources");

    return recommendations;
  }

  private generateSummary(addressInfo: AddressInfo, totalValue: number, riskAssessment: string, transactionCount: number): string {
    return `Address ${addressInfo.address} has processed ${totalValue.toFixed(4)} ${addressInfo.address.startsWith('0x') ? 'ETH' : 'BTC'} across ${transactionCount} transactions. Risk Assessment: ${riskAssessment}. ${addressInfo.tags.includes('exchange') ? 'Identified as exchange wallet.' : addressInfo.tags.includes('high-risk') ? 'Flagged as high-risk address.' : 'Standard wallet activity detected.'} Last activity: ${addressInfo.lastSeen.toLocaleDateString()}.`;
  }
}

export const cryptoTracker = new CryptoTracker();