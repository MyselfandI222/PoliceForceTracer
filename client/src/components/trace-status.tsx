import { Clock, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TraceStatusProps {
  status: string;
  isPremium: boolean;
  estimatedCompletion?: Date;
  className?: string;
}

export function TraceStatus({ status, isPremium, estimatedCompletion, className = "" }: TraceStatusProps) {
  const getStatusColor = (status: string, isPremium: boolean) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return isPremium ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
      case 'queued': return isPremium ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string, isPremium: boolean) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return isPremium ? <Zap className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
      case 'queued': return isPremium ? <Zap className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string, isPremium: boolean) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'processing': return isPremium ? 'Processing (Premium)' : 'Processing';
      case 'queued': return isPremium ? 'Premium Queue' : 'Scheduled for 11:59 PM';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'processing': return 75;
      case 'queued': return 25;
      default: return 0;
    }
  };

  const formatEstimatedCompletion = (date?: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const completion = new Date(date);
    const diffMs = completion.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Within 1 hour';
    } else if (diffHours < 24) {
      return `~${diffHours} hours`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `~${diffDays} days`;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(status, isPremium)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(status, isPremium)}
            {getStatusText(status, isPremium)}
          </div>
        </Badge>
        {isPremium && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Zap className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
      </div>
      
      {status !== 'completed' && (
        <div className="space-y-1">
          <Progress value={getProgressValue(status)} className="h-2" />
          {estimatedCompletion && (
            <p className="text-xs text-slate-500">
              {status === 'queued' && !isPremium 
                ? `Next processing: Today at 11:59 PM (${formatEstimatedCompletion(estimatedCompletion)})`
                : `Est. completion: ${formatEstimatedCompletion(estimatedCompletion)}`
              }
            </p>
          )}
        </div>
      )}
      
      {status === 'queued' && !isPremium && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border">
          <Clock className="h-4 w-4 inline mr-1" />
          <strong>Free Trace:</strong> All free traces are processed automatically at 11:59 PM daily. 
          Upgrade to Premium for instant processing.
        </div>
      )}
    </div>
  );
}