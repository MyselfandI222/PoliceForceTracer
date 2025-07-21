import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  File,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickExportButtonProps {
  traceId: string;
  caseNumber?: string;
  reportData?: any;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function QuickExportButton({ 
  traceId, 
  caseNumber, 
  reportData,
  size = "sm",
  variant = "outline"
}: QuickExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateMockReport = () => {
    // Mock report data for demonstration
    return {
      reportId: `RPT-${traceId}`,
      caseNumber: caseNumber || 'CRY-2024-78432',
      generatedAt: new Date(),
      targetAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      cryptocurrency: 'Bitcoin (BTC)',
      totalValue: 125000.50,
      riskAssessment: 'MEDIUM RISK',
      summary: 'Cryptocurrency trace investigation complete. Medium risk factors identified.',
      transactions: [
        {
          hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
          from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          to: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          amount: 50.0,
          timestamp: new Date('2024-07-15T10:30:00Z'),
          blockHeight: 850000,
          confirmations: 145,
          fee: 0.0001
        }
      ],
      recommendations: [
        'Continue monitoring identified addresses',
        'Coordinate with exchange compliance teams',
        'Consider additional blockchain analysis tools'
      ]
    };
  };

  const handleQuickExport = async (format: 'pdf' | 'csv' | 'json' | 'txt') => {
    setIsExporting(true);
    
    try {
      const report = reportData || generateMockReport();
      const timestamp = new Date().toISOString().split('T')[0];
      const caseName = caseNumber || 'CRY-TRACE';
      const filename = `${caseName}_${report.reportId}_${timestamp}.${format}`;
      
      switch (format) {
        case 'csv':
          const csvData = [
            ['Transaction Hash', 'From', 'To', 'Amount', 'Date', 'Block Height'],
            ...report.transactions.map((tx: any) => [
              tx.hash,
              tx.from,
              tx.to,
              tx.amount.toString(),
              tx.timestamp.toISOString(),
              tx.blockHeight.toString()
            ])
          ];
          const csvContent = csvData.map(row => 
            row.map((field: string) => `"${field}"`).join(',')
          ).join('\n');
          downloadFile(csvContent, filename, 'text/csv');
          break;

        case 'json':
          const jsonContent = JSON.stringify(report, null, 2);
          downloadFile(jsonContent, filename, 'application/json');
          break;

        case 'txt':
          const textContent = `CRYPTOCURRENCY TRACE REPORT
Report ID: ${report.reportId}
Case Number: ${report.caseNumber}
Generated: ${report.generatedAt.toLocaleString()}
Target Address: ${report.targetAddress}
Cryptocurrency: ${report.cryptocurrency}
Total Value: $${report.totalValue.toLocaleString()}
Risk Assessment: ${report.riskAssessment}

SUMMARY
${report.summary}

TRANSACTIONS (${report.transactions.length})
${report.transactions.map((tx: any) => 
  `${tx.hash} | ${tx.from} → ${tx.to} | ${tx.amount} BTC | ${tx.timestamp.toLocaleDateString()}`
).join('\n')}

RECOMMENDATIONS
${report.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}`;
          downloadFile(textContent, filename, 'text/plain');
          break;

        case 'pdf':
          // For now, export as text with PDF naming
          const pdfContent = `CRYPTOCURRENCY TRACE REPORT
Report ID: ${report.reportId}
Case Number: ${report.caseNumber}
Generated: ${report.generatedAt.toLocaleString()}

This is a text version of the PDF report.
PDF generation with proper formatting will be available in the next update.

TARGET ADDRESS ANALYSIS
Address: ${report.targetAddress}
Cryptocurrency: ${report.cryptocurrency}
Total Value Traced: $${report.totalValue.toLocaleString()}
Risk Level: ${report.riskAssessment}

${report.summary}`;
          downloadFile(pdfContent, filename.replace('.pdf', '.txt'), 'text/plain');
          toast({
            title: "PDF Export",
            description: "PDF generation coming soon. Exported as text file for now.",
          });
          break;
      }
      
      toast({
        title: "Export Successful",
        description: `Report exported as ${filename}`,
      });
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={isExporting}
          className={variant === "outline" ? "border-green-200 text-green-700 hover:bg-green-50" : ""}
        >
          <Download className="w-4 h-4 mr-1" />
          {size !== "sm" && "Export"}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleQuickExport('pdf')}>
          <FileText className="w-4 h-4 mr-2" />
          PDF Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickExport('csv')}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          CSV Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickExport('json')}>
          <FileCode className="w-4 h-4 mr-2" />
          JSON Export
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickExport('txt')}>
          <File className="w-4 h-4 mr-2" />
          Text Summary
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}