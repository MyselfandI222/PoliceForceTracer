import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Info, Clock, Zap, DollarSign, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const victimTraceFormSchema = z.object({
  caseNumber: z.string().min(1, "Case number is required"),
  cryptoType: z.string().min(1, "Cryptocurrency type is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  victimName: z.string().min(1, "Your name is required"),
  incidentDate: z.string().min(1, "Incident date is required"),
  description: z.string().min(1, "Description is required"),
  traceType: z.enum(["free", "premium"]),
  stolenAmount: z.string().optional(),
});

type VictimTraceFormData = z.infer<typeof victimTraceFormSchema>;

interface VictimTraceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VictimTraceForm({ onSuccess, onCancel }: VictimTraceFormProps) {
  const [isPremiumSelected, setIsPremiumSelected] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<VictimTraceFormData>({
    resolver: zodResolver(victimTraceFormSchema),
    defaultValues: {
      caseNumber: "CRY-2024-78432",
      cryptoType: "Bitcoin",
      walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      victimName: "John Victim",
      incidentDate: "2024-01-15",
      description: "Cryptocurrency theft through phishing email attack",
      traceType: "free",
      stolenAmount: "$125,000",
    },
  });

  const createTraceMutation = useMutation({
    mutationFn: async (data: VictimTraceFormData) => {
      const isPremium = data.traceType === "premium";
      const response = await apiRequest("POST", "/api/traces", {
        caseNumber: data.caseNumber,
        cryptoType: data.cryptoType,
        walletAddress: data.walletAddress,
        victimName: data.victimName,
        incidentDate: new Date(data.incidentDate).toISOString(),
        description: data.description,
        isPremium,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/traces"] });
      
      if (data.clientSecret) {
        // Handle Stripe payment for premium traces
        toast({
          title: "Payment Required",
          description: "Redirecting to payment processing...",
        });
        // In a real app, this would redirect to Stripe checkout
        setTimeout(() => {
          toast({
            title: "Payment Successful",
            description: "Your premium trace has been initiated and will complete within 1-2 hours.",
          });
          onSuccess?.();
        }, 2000);
      } else {
        toast({
          title: "Trace Created",
          description: "Your trace has been queued for Wednesday processing.",
        });
        onSuccess?.();
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create trace. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VictimTraceFormData) => {
    createTraceMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900">
          Submit Cryptocurrency Trace Request
        </CardTitle>
        <p className="text-slate-600">
          Provide details about your stolen cryptocurrency for investigation
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="caseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Number</FormLabel>
                    <FormControl>
                      <Input placeholder="CRY-2024-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="victimName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cryptoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cryptocurrency Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bitcoin">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="Ethereum">Ethereum (ETH)</SelectItem>
                        <SelectItem value="Litecoin">Litecoin (LTC)</SelectItem>
                        <SelectItem value="Bitcoin Cash">Bitcoin Cash (BCH)</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stolenAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stolen Amount (USD)</FormLabel>
                    <FormControl>
                      <Input placeholder="$125,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suspect Wallet Address</FormLabel>
                    <FormControl>
                      <Input placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="incidentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Describe how the theft occurred..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="traceType"
              render={({ field }) => (
                <FormItem>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="text-blue-600 mt-0.5 w-5 h-5" />
                      <div className="w-full">
                        <h4 className="text-sm font-medium text-blue-900 mb-3">Trace Options</h4>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setIsPremiumSelected(value === "premium");
                            }}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-start space-x-3 p-3 bg-white rounded border">
                              <RadioGroupItem value="free" id="free" className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor="free" className="text-sm font-medium text-slate-900 cursor-pointer">
                                  Free Weekly Trace
                                </Label>
                                <p className="text-xs text-slate-500 mt-1">Processed Wednesdays at 11:59 PM • Results available Thursday morning</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded border border-amber-200">
                              <RadioGroupItem value="premium" id="premium" className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor="premium" className="text-sm font-medium text-amber-900 cursor-pointer flex items-center gap-2">
                                  <Zap className="h-4 w-4" />
                                  Premium Instant Trace - $995
                                </Label>
                                <p className="text-xs text-amber-700 mt-1">Immediate processing • Results in 1-2 hours • Priority investigation</p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                                  <CreditCard className="h-3 w-3" />
                                  <span>Secure payment required</span>
                                </div>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        
                        {field.value === "free" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                            <div className="flex items-center gap-2 text-green-700">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">Scheduled Processing</span>
                            </div>
                            <p className="text-green-700 mt-1">
                              Your trace will be automatically processed this Wednesday at 11:59 PM. 
                              Results will be available Thursday morning via email notification.
                            </p>
                          </div>
                        )}
                        
                        {field.value === "premium" && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                            <div className="flex items-center gap-2 text-amber-700">
                              <Zap className="h-4 w-4" />
                              <span className="font-medium">Instant Processing</span>
                            </div>
                            <p className="text-amber-700 mt-1">
                              Your trace will begin processing immediately after payment confirmation. 
                              Our advanced blockchain forensics team will prioritize your case with results typically available within 1-2 hours.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTraceMutation.isPending}
                className={isPremiumSelected ? "bg-amber-600 hover:bg-amber-700" : "bg-primary hover:bg-blue-700"}
              >
                {createTraceMutation.isPending ? "Submitting..." : 
                 isPremiumSelected ? "Proceed to Payment ($995)" : "Submit Free Trace Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}