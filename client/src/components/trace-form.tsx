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
import { AlertCircle, Info, Clock, Zap, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const traceFormSchema = z.object({
  caseNumber: z.string().min(1, "Case number is required"),
  cryptoType: z.string().min(1, "Cryptocurrency type is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  victimName: z.string().min(1, "Victim name is required"),
  incidentDate: z.string().min(1, "Incident date is required"),
  description: z.string().min(1, "Description is required"),
  traceType: z.enum(["free", "premium"]).optional(),
});

type TraceFormData = z.infer<typeof traceFormSchema>;

interface TraceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  userType?: 'officer' | 'victim'; // New prop to determine user type
}

export function TraceForm({ onSuccess, onCancel, userType = 'officer' }: TraceFormProps) {
  const [isPremiumSelected, setIsPremiumSelected] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TraceFormData>({
    resolver: zodResolver(traceFormSchema),
    defaultValues: {
      caseNumber: "",
      cryptoType: "",
      walletAddress: "",
      victimName: "",
      incidentDate: "",
      description: "",
      traceType: userType === 'officer' ? undefined : "free",
    },
  });

  const createTraceMutation = useMutation({
    mutationFn: async (data: TraceFormData) => {
      const isPremium = data.traceType === "premium";
      const response = await apiRequest("POST", "/api/traces", {
        caseNumber: data.caseNumber,
        cryptoType: data.cryptoType,
        walletAddress: data.walletAddress,
        victimName: data.victimName,
        incidentDate: new Date(data.incidentDate).toISOString(),
        description: data.description,
        isPremium: userType === 'officer' ? false : isPremium, // Officers always submit as free cases
        submittedBy: userType,
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
            description: "Your premium trace has been initiated.",
          });
          onSuccess?.();
        }, 2000);
      } else {
        toast({
          title: userType === 'officer' ? "Case Submitted" : "Trace Created",
          description: userType === 'officer' ? 
            "Case has been submitted. The victim will be notified to choose processing options." :
            "Your trace has been queued for processing.",
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

  const onSubmit = (data: TraceFormData) => {
    createTraceMutation.mutate(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          {userType === 'officer' ? 'Submit Case Information' : 'Start New Cryptocurrency Trace'}
        </CardTitle>
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
                      <Input placeholder="2024-001" {...field} />
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
                        <SelectItem value="Bitcoin (BTC)">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="Ethereum (ETH)">Ethereum (ETH)</SelectItem>
                        <SelectItem value="Litecoin (LTC)">Litecoin (LTC)</SelectItem>
                        <SelectItem value="Monero (XMR)">Monero (XMR)</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" {...field} />
                  </FormControl>
                  <div className="text-xs text-blue-600 mt-1 p-2 bg-blue-50 rounded border">
                    <strong>Test Addresses (with real transaction history):</strong>
                    <div className="mt-1 space-y-1 font-mono text-xs">
                      <div><strong>Bitcoin:</strong> 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa (Satoshi's Genesis)</div>
                      <div><strong>Bitcoin:</strong> 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 (BitFinex Hack)</div>
                      <div><strong>Ethereum:</strong> 0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae (Ethereum Foundation)</div>
                      <div><strong>Ethereum:</strong> 0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be (Binance Hot Wallet)</div>
                    </div>
                    <div className="text-blue-700 mt-2">These addresses have extensive transaction histories perfect for testing blockchain analysis.</div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="victimName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Victim Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Case Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Brief description of the theft incident..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === 'officer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="text-blue-600 mt-0.5 w-5 h-5" />
                  <div className="w-full">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Case Submission</h4>
                    <p className="text-blue-700 text-sm">
                      This case will be submitted for the victim to review. The victim can then choose their preferred processing option: 
                      free weekly processing (Wednesdays at 11:59 PM) or premium instant processing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTraceMutation.isPending}
                className="bg-primary hover:bg-blue-700"
              >
                {createTraceMutation.isPending ? "Submitting..." : 
                 userType === 'officer' ? "Submit Case Information" : "Submit Trace Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
