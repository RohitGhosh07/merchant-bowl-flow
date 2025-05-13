
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormData } from "@/types/formTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Committee member data
const committeeMembers = [
  { id: '1', name: 'Sanjay Lakhotia', designation: 'Committee Member' },
  { id: '2', name: 'Vikram Poddar', designation: 'Committee Member' },
  { id: '3', name: 'Rajesh Kankaria', designation: 'Committee Member' },
  { id: '4', name: 'Prashant Mehra', designation: 'Committee Member' },
  { id: '5', name: 'Timir Roy', designation: 'Committee Member' },
  { id: '6', name: 'Chandan Shroff', designation: 'Committee Member' },
  { id: '7', name: 'Somenath Chatterjee', designation: 'Committee Member' },
  { id: '8', name: 'Devesh Srivastava', designation: 'Committee Member' },
  { id: '9', name: 'Samit Malhotra', designation: 'Committee Member' },
  { id: '10', name: 'Agnesh Kumar Verma', designation: 'Committee Member' },
];

interface PaymentSelectionProps {
  formData: FormData;
  onComplete: (paymentStatus: string, referenceInfo?: Record<string, string>) => void;
}

const PaymentSelection = ({ formData, onComplete }: PaymentSelectionProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [referredBy, setReferredBy] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as 'online' | 'offline');
  };

  const handleProceed = () => {
    if (paymentMethod === 'online') {
      // Redirect to the payment gateway
      const name = encodeURIComponent(formData.companyName);
      const phoneNumber = encodeURIComponent(formData.contactPhone);
      const amount = formData.totalAmount;
      
      window.location.href = `https://rcgcbooking.in/ccavenue_pg_v2/make_payment_merchant.php?organization_id=RCGC&name=${name}&phone_number=${phoneNumber}&amount=${amount}`;
    } else {
      // Handle offline payment
      if (!selectedMember) {
        toast({
          title: "Committee Member Required",
          description: "Please select a committee member you're paying to.",
          variant: "destructive",
        });
        return;
      }

      // Mark the registration as unpaid/pending in Supabase
      const referenceInfo = {
        committeeMember: selectedMember,
        referredBy: referredBy || "Not specified"
      };
      
      onComplete("Pending", referenceInfo);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl">Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Please select your payment method</h2>
          
          <RadioGroup 
            value={paymentMethod}
            onValueChange={handlePaymentMethodChange} 
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label
                htmlFor="online"
                className="flex flex-col cursor-pointer p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Online Payment</span>
                <span className="text-sm text-gray-500">Pay securely online</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="offline" />
              <Label
                htmlFor="offline"
                className="flex flex-col cursor-pointer p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Offline Payment</span>
                <span className="text-sm text-gray-500">Pay to Committee Member</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'offline' && (
          <div className="space-y-4 animate-in fade-in-50">
            <div className="space-y-2">
              <Label>Who are you paying to?</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a committee member" />
                </SelectTrigger>
                <SelectContent>
                  {committeeMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Who referred you? (Optional)</Label>
              <Input 
                placeholder="Enter name of the person who referred you"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
              />
            </div>
          </div>
        )}

        {paymentMethod === 'online' && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Online Payment Details</h3>
            <p className="text-sm text-blue-600 mb-2">Amount: ₹{formData.totalAmount.toLocaleString()}</p>
            <p className="text-sm text-blue-600">You will be redirected to the payment gateway.</p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button 
            type="button"
            className={paymentMethod === 'online' ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
            onClick={handleProceed}
          >
            {paymentMethod === 'online' ? 'Proceed to Payment' : 'Submit Payment Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSelection;
