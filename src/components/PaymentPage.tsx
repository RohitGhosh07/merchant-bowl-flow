
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FormData, GoogleSheetsIntegration } from "@/types/formTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { appendToSheet, formatTeamData } from "@/utils/googleSheets";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Check, LoaderCircle } from "lucide-react";

interface PaymentPageProps {
  formData: FormData;
  onPaymentComplete: () => void;
}

const PaymentPage = ({ formData, onPaymentComplete }: PaymentPageProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [webhook, setWebhook] = useState<string>("");

  const [sheetsIntegration, setSheetsIntegration] = useState<GoogleSheetsIntegration>({
    enabled: false,
    apiKey: "",
    spreadsheetId: "",
    sheetName: "Sheet1"
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhook(e.target.value);
  };

  const handleSheetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSheetsIntegration({ ...sheetsIntegration, [name]: value });
  };

  const handleSheetsToggle = (checked: boolean) => {
    setSheetsIntegration({ ...sheetsIntegration, enabled: checked });
  };

  const processPayment = async () => {
    setLoading(true);
    
    try {
      // Show a processing toast
      toast({
        title: "Processing Payment",
        description: "Please wait while we process your payment...",
      });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add registration data to Supabase
      const registrationPromises = formData.teams.map(async (team, i) => {
        const teamNumber = `Team ${i + 1}`;
        
        try {
          const { error } = await supabase.from("registrations").insert({
            company_name: formData.companyName,
            team_number: teamNumber,
            player1_name: team.player1.name,
            player2_name: team.player2.name,
            captain_name: formData.captainName,
            payment_status: "Paid"
          });
          
          if (error) {
            console.error("Error inserting registration data:", error);
            throw error;
          }
          
          return true;
        } catch (error) {
          console.error("Error with Supabase:", error);
          throw error;
        }
      });
      
      // Wait for all registrations to complete
      await Promise.all(registrationPromises);
      
      // Show success toast for database registration
      toast({
        title: "Registration Saved",
        description: "Your registration data has been saved to the database.",
      });

      // Google Sheets integration
      if (sheetsIntegration.enabled && sheetsIntegration.apiKey && sheetsIntegration.spreadsheetId) {
        try {
          const rows = formatTeamData(formData);
          const success = await appendToSheet(
            {
              apiKey: sheetsIntegration.apiKey,
              spreadsheetId: sheetsIntegration.spreadsheetId,
              sheetName: sheetsIntegration.sheetName || "Sheet1"
            }, 
            rows
          );
          
          if (success) {
            toast({
              title: "Google Sheets Updated",
              description: "Your registration data has been saved to Google Sheets.",
            });
          } else {
            toast({
              title: "Google Sheets Error",
              description: "Could not save data to Google Sheets. Check console for details.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error with Google Sheets integration:", error);
          toast({
            title: "Google Sheets Error",
            description: "There was an error with the Google Sheets integration.",
            variant: "destructive",
          });
        }
      }
      
      // If webhook URL is provided, trigger the Zapier webhook
      if (webhook) {
        try {
          await fetch(webhook, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors", // Handle CORS issues
            body: JSON.stringify({
              companyName: formData.companyName,
              captainName: formData.captainName,
              numTeams: formData.numTeams,
              amount: formData.totalAmount,
              timestamp: new Date().toISOString(),
              paymentStatus: "success",
            }),
          });
          console.log("Webhook triggered successfully");
        } catch (error) {
          console.error("Error triggering webhook:", error);
        }
      }

      // Show success message
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      
      // Proceed to receipt
      onPaymentComplete();
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-bowlsNavy">
          Payment
        </h2>
        <p className="text-gray-600">
          Please complete the payment to finish your registration.
        </p>
      </div>

      <Card className="bg-white shadow-md border-none mb-6">
        <CardHeader className="bg-gradient-to-r from-bowlsNavy to-bowlsNavy-dark text-white rounded-t-lg">
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-medium">{formData.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of Teams</p>
                <p className="font-medium">{formData.numTeams}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Registration Fee</p>
                <p className="font-medium">₹8,850 per team</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-lg text-bowlsGreen">₹{formData.totalAmount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md border-none mb-6">
        <CardHeader className="bg-gradient-to-r from-bowlsGold to-bowlsGold-dark text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
              <TabsTrigger value="upi">UPI</TabsTrigger>
              <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    name="cardHolder"
                    value={cardDetails.cardHolder}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      type="password"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-gray-700">
                  <p className="font-medium">Test Mode Notice</p>
                  <p className="mt-1">
                    This is a test payment gateway. No actual payment will be processed.
                    For testing, you can use any card details.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upi" className="mt-6">
              <div className="text-center py-6">
                <div className="bg-gray-100 rounded-lg p-6 inline-block mx-auto mb-4">
                  <div className="text-2xl font-mono bg-white p-4 rounded-md border">
                    rcgc.tournament@ybl
                  </div>
                </div>
                <p className="text-gray-600">
                  Scan the QR code or enter the UPI ID in your payment app to make the payment.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-gray-700 mt-4">
                  <p className="font-medium">Test Mode Notice</p>
                  <p className="mt-1">
                    This is a test UPI ID. No actual payment will be processed.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="netbanking" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="border rounded-md p-3 text-center hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">SBI</p>
                </div>
                <div className="border rounded-md p-3 text-center hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">HDFC</p>
                </div>
                <div className="border rounded-md p-3 text-center hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">ICICI</p>
                </div>
                <div className="border rounded-md p-3 text-center hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">Axis</p>
                </div>
                <div className="border rounded-md p-3 text-center hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">Kotak</p>
                </div>
                <div className="border rounded-md p-3 text-center hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">Other Banks</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-gray-700">
                <p className="font-medium">Test Mode Notice</p>
                <p className="mt-1">
                  This is a test net banking interface. No actual payment will be processed.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 border-t pt-4">
            <Label htmlFor="webhookUrl">
              Zapier Webhook URL (Optional - for integration with WhatsApp/Email)
            </Label>
            <Input
              id="webhookUrl"
              value={webhook}
              onChange={handleWebhookChange}
              placeholder="https://hooks.zapier.com/..."
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your Zapier webhook URL to integrate with WhatsApp, Email notifications.
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-6 border-t pt-4">
            <AccordionItem value="sheets">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={sheetsIntegration.enabled} 
                    onCheckedChange={handleSheetsToggle}
                    onClick={(e) => e.stopPropagation()} 
                  />
                  <span>Google Sheets Integration</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {sheetsIntegration.enabled && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="apiKey">Google Sheets API Key</Label>
                      <Input
                        id="apiKey"
                        name="apiKey"
                        value={sheetsIntegration.apiKey}
                        onChange={handleSheetsChange}
                        placeholder="AIzaSyB..."
                        className="mt-1.5"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your Google Cloud API key with Google Sheets API enabled.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
                      <Input
                        id="spreadsheetId"
                        name="spreadsheetId"
                        value={sheetsIntegration.spreadsheetId}
                        onChange={handleSheetsChange}
                        placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The ID of your Google Sheet (found in the URL).
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="sheetName">Sheet Name (Optional)</Label>
                      <Input
                        id="sheetName"
                        name="sheetName"
                        value={sheetsIntegration.sheetName}
                        onChange={handleSheetsChange}
                        placeholder="Sheet1"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The name of the specific sheet tab to write to (defaults to "Sheet1").
                      </p>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={processPayment} 
            disabled={loading}
            className="bg-bowlsGreen hover:bg-bowlsGreen-dark flex items-center gap-2"
          >
            {loading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Pay ₹{formData.totalAmount}</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;
