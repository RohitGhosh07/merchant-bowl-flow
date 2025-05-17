import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormData } from "@/types/formTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

interface PaymentSelectionProps {
  formData: FormData;
  registrationId: string; // ID from tracking_id
  onComplete: (paymentStatus: string, referenceInfo?: Record<string, any>) => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({ formData, registrationId, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [committeeMember, setCommitteeMember] = useState<string>("");
  const [referredBy, setReferredBy] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const fixedAmount = 10030;

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as 'online' | 'offline');
  };
  const updatePaymentDetails = async (paymentInfo: any) => {
    try {
      // Map the payment info to match database columns
      const dbUpdate = {
        payment_method: paymentInfo.payment_method,
        payment_status: paymentInfo.payment_status,
        committee_member: paymentInfo.committee_member,
        referred_name: paymentInfo.referred_name,
        payment_date: paymentInfo.payment_date,
        amount: paymentInfo.amount,
        // Map other form data to database columns
        captain_name: formData.captainName,
        captain_phone: formData.contactPhone,
        captain_email: formData.contactEmail,
        company_name: formData.companyName,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        contact_address: formData.address,
        captain_designation: formData.designation,
        gst_number: formData.gstNumber
      };

      const { error } = await supabase
        .from('registrations')
        .update(dbUpdate)
        .eq('id', registrationId); // Use tracking_id for updates

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating payment details:', error);
      toast({
        title: "Error",
        description: "Failed to update payment details. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleProceed = async () => {    if (paymentMethod === 'online') {
      // For online payments, save referral info and update status to "Online"
      const paymentInfo = {
        payment_method: 'online',
        payment_status: 'Online',
        referred_name: referredBy,  // Pass the referred name directly
        payment_date: new Date().toISOString(),
        amount: fixedAmount
      };
      
      try {
        await updatePaymentDetails(paymentInfo);
        await onComplete("Online", paymentInfo);
          // After updating the database, redirect to payment gateway
        const name = encodeURIComponent(formData.captainName || formData.companyName);
        const phoneNumber = encodeURIComponent(formData.contactPhone);
        const email = encodeURIComponent(formData.contactEmail);
        const companyName = encodeURIComponent(formData.companyName);
        
        window.location.href = `https://rcgcbooking.in/ccavenue_pg_v2/make_payment_merchant.php?organization_id=RCGC&name=${name}&phone_number=${phoneNumber}&amount=${fixedAmount}&email=${email}&company_name=${companyName}`;
      } catch (error) {
        return;
      }
    } else {
      // For offline payments, require committee member name
      if (!committeeMember.trim()) {
        toast({
          title: "Payment Information Required",
          description: "Please enter the name of the committee member you're paying to.",
          variant: "destructive",
        });
        return;
      }

      // Save offline payment details with committee member name and referral info
      const paymentInfo = {
        payment_method: 'offline',
        payment_status: 'Pending',
        committee_member: committeeMember.trim(),
        referred_name: referredBy,  // Pass the referred name directly
        payment_date: new Date().toISOString(),
        amount: fixedAmount
      };
      
      try {
        await updatePaymentDetails(paymentInfo);
        await onComplete("Pending", paymentInfo);
        
        toast({
          title: "Success",
          description: "Payment details saved successfully.",
          variant: "default",
        });
      } catch (error) {
        return;
      }
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
          <div className="space-y-4 animate-in fade-in-50">            <div className="space-y-2">
              <Label>Who are you paying to?</Label>
              <Input 
                placeholder="Enter committee member's name"
                value={committeeMember}
                onChange={(e) => setCommitteeMember(e.target.value)}
              />
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
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Online Payment Details</h3>
              <div className="flex items-center gap-1 text-sm text-blue-600 mb-2">
                <IndianRupee className="h-4 w-4" />
                <span>{fixedAmount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-blue-600">You will be redirected to the payment gateway.</p>
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
