import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  File, 
  FileSpreadsheet,
  FileCode,
  Printer,
  Settings,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TraceReport {
  targetAddress: string;
  cryptocurrency: string;
  totalValue: number;
  riskAssessment: string;
  summary: string;
  transactions: any[];
  connectedAddresses: any[];
  flowAnalysis: any;
  riskFactors: any[];
  recommendations: string[];
  reportId: string;
  generatedAt: Date;
}

interface ExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'txt' | 'xlsx';
  sections: {
    overview: boolean;
    transactions: boolean;
    addresses: boolean;
    flowAnalysis: boolean;
    riskFactors: boolean;
    recommendations: boolean;
  };
  includeCharts: boolean;
  includeLogos: boolean;
  dateFormat: 'iso' | 'us' | 'eu';
}

interface ExportDialogProps {
  report: TraceReport;
  caseNumber?: string;
  children: React.ReactNode;
}

export function ExportDialog({ report, caseNumber, children }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    sections: {
      overview: true,
      transactions: true,
      addresses: true,
      flowAnalysis: true,
      riskFactors: true,
      recommendations: true,
    },
    includeCharts: true,
    includeLogos: true,
    dateFormat: 'us',
  });
  const { toast } = useToast();

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Professional formatted report' },
    { value: 'csv', label: 'CSV Data', icon: FileSpreadsheet, description: 'Transaction data for analysis' },
    { value: 'json', label: 'JSON Export', icon: FileCode, description: 'Raw data for integration' },
    { value: 'xlsx', label: 'Excel Workbook', icon: FileSpreadsheet, description: 'Structured spreadsheet format' },
    { value: 'txt', label: 'Text Summary', icon: File, description: 'Plain text for reports' },
  ];

  const updateSection = (section: keyof ExportOptions['sections'], checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: checked,
      },
    }));
  };

  const generateFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const caseName = caseNumber || 'CRY-TRACE';
    const extension = exportOptions.format === 'xlsx' ? 'xlsx' : exportOptions.format;
    return `${caseName}_${report.reportId}_${timestamp}.${extension}`;
  };

  const exportToCSV = () => {
    const csvData = [];
    
    // Headers
    csvData.push([
      'Transaction Hash',
      'From Address',
      'To Address', 
      'Amount',
      'Timestamp',
      'Block Height',
      'Confirmations',
      'Fee'
    ]);
    
    // Transaction data
    report.transactions.forEach(tx => {
      csvData.push([
        tx.hash,
        tx.from,
        tx.to,
        tx.amount.toString(),
        tx.timestamp.toISOString(),
        tx.blockHeight.toString(),
        tx.confirmations.toString(),
        tx.fee.toString()
      ]);
    });
    
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    return csvContent;
  };

  const exportToJSON = () => {
    const exportData = {
      reportInfo: {
        reportId: report.reportId,
        caseNumber: caseNumber,
        generatedAt: report.generatedAt,
        targetAddress: report.targetAddress,
        cryptocurrency: report.cryptocurrency,
      },
      ...(exportOptions.sections.overview && {
        overview: {
          totalValue: report.totalValue,
          riskAssessment: report.riskAssessment,
          summary: report.summary,
        }
      }),
      ...(exportOptions.sections.transactions && {
        transactions: report.transactions
      }),
      ...(exportOptions.sections.addresses && {
        connectedAddresses: report.connectedAddresses
      }),
      ...(exportOptions.sections.flowAnalysis && {
        flowAnalysis: report.flowAnalysis
      }),
      ...(exportOptions.sections.riskFactors && {
        riskFactors: report.riskFactors
      }),
      ...(exportOptions.sections.recommendations && {
        recommendations: report.recommendations
      }),
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const exportToText = () => {
    const sections = [];
    
    if (exportOptions.sections.overview) {
      sections.push(`CRYPTOCURRENCY TRACE REPORT
Report ID: ${report.reportId}
Case Number: ${caseNumber || 'N/A'}
Generated: ${report.generatedAt.toLocaleString()}
Target Address: ${report.targetAddress}
Cryptocurrency: ${report.cryptocurrency}
Total Value: $${report.totalValue.toLocaleString()}
Risk Assessment: ${report.riskAssessment}

EXECUTIVE SUMMARY
${report.summary}`);
    }
    
    if (exportOptions.sections.transactions) {
      sections.push(`TRANSACTION ANALYSIS
Total Transactions: ${report.transactions.length}

${report.transactions.map(tx => 
  `Hash: ${tx.hash}
From: ${tx.from}
To: ${tx.to}
Amount: ${tx.amount} ${report.cryptocurrency}
Time: ${tx.timestamp.toLocaleString()}
Block: ${tx.blockHeight}
`).join('\n')}`);
    }
    
    if (exportOptions.sections.riskFactors) {
      sections.push(`RISK FACTORS
${report.riskFactors.map(risk => 
  `• ${risk.factor} (${risk.severity.toUpperCase()}): ${risk.description}`
).join('\n')}`);
    }
    
    if (exportOptions.sections.recommendations) {
      sections.push(`RECOMMENDATIONS
${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}`);
    }
    
    return sections.join('\n\n' + '='.repeat(50) + '\n\n');
  };

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

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filename = generateFileName();
      
      switch (exportOptions.format) {
        case 'csv':
          const csvContent = exportToCSV();
          downloadFile(csvContent, filename, 'text/csv');
          break;
          
        case 'json':
          const jsonContent = exportToJSON();
          downloadFile(jsonContent, filename, 'application/json');
          break;
          
        case 'txt':
          const textContent = exportToText();
          downloadFile(textContent, filename, 'text/plain');
          break;
          
        case 'pdf':
          // For PDF, we'll send the data to the backend to generate
          toast({
            title: "PDF Export",
            description: "PDF generation will be available in the next update. Using text format for now.",
          });
          const pdfContent = exportToText();
          downloadFile(pdfContent, filename.replace('.pdf', '.txt'), 'text/plain');
          break;
          
        case 'xlsx':
          toast({
            title: "Excel Export",
            description: "Excel generation will be available in the next update. Using CSV format for now.",
          });
          const xlsxContent = exportToCSV();
          downloadFile(xlsxContent, filename.replace('.xlsx', '.csv'), 'text/csv');
          break;
      }
      
      toast({
        title: "Export Successful",
        description: `Report exported as ${filename}`,
      });
      
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Investigation Report</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Export Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={exportOptions.format} onValueChange={(value: any) => 
                setExportOptions(prev => ({ ...prev, format: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <option.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-slate-500">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Section Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Report Sections</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {Object.entries(exportOptions.sections).map(([section, checked]) => (
                <div key={section} className="flex items-center space-x-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(checked) => updateSection(section as any, !!checked)}
                  />
                  <label className="text-sm capitalize">
                    {section.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Options */}
          {(exportOptions.format === 'pdf' || exportOptions.format === 'xlsx') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={exportOptions.includeCharts}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                    }
                  />
                  <label className="text-sm">Include charts and graphs</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={exportOptions.includeLogos}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeLogos: !!checked }))
                    }
                  />
                  <label className="text-sm">Include agency logos</label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Summary */}
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Export Preview</p>
                  <p className="text-xs text-slate-600">{generateFileName()}</p>
                </div>
                <Badge variant="outline">
                  {Object.values(exportOptions.sections).filter(Boolean).length} sections
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting || Object.values(exportOptions.sections).every(v => !v)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-pulse" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}