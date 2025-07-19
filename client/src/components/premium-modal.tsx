import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, Check } from "lucide-react";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade?: () => void;
}

export function PremiumModal({ open, onOpenChange, onUpgrade }: PremiumModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simulate Stripe checkout process
    setTimeout(() => {
      setIsProcessing(false);
      onUpgrade?.();
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Premium Instant Trace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Zap className="text-white text-2xl" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">Get Results in 1-2 Hours</h4>
            <p className="text-slate-600">Skip the queue and get priority processing for urgent investigations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Free Tier</h5>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  <span>3-7 day processing time</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  <span>5 traces per week limit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  <span>Basic analysis reports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  <span>Email notifications</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-3">Premium Tier</h5>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>1-2 hour processing time</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Unlimited traces</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Advanced analysis & patterns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">$995</div>
            <p className="text-slate-600">Per premium trace</p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white text-center">
            <p className="mb-4">Secure payment processing via Stripe</p>
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={handleUpgrade}
              disabled={isProcessing}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Pay with Card"}
            </Button>
            <p className="text-blue-100 text-xs mt-2">PCI DSS compliant • 256-bit SSL encryption</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
