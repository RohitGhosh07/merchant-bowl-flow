import { useState } from "react";
import { Link } from "react-router-dom";
import RegistrationForm from "@/components/RegistrationForm";
import { FormData } from "@/types/formTypes";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReceiptPage from "@/components/ReceiptPage";
import PaymentSelection from "@/components/PaymentSelection";
import { sendRegistrationEmail } from "@/services/emailService";
import { generateTrackingId } from "@/utils/trackingId";
import Navbar from "@/components/Navbar";

// Import logo paths and account for base path
const logoPath = import.meta.env.BASE_URL + 'logo.jpeg';
const rcgcLogoPath = import.meta.env.BASE_URL + 'rcgc.jpeg';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "receipt">("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Fixed amount regardless of number of teams
  const fixedAmount = 10030;

  const handleFormSubmit = async (data: FormData) => {
    // Ensure the total amount is set to the fixed amount
    const updatedData = {
      ...data,
      totalAmount: fixedAmount
    };
    
    setFormData(updatedData);
    // Move to the payment selection page
    setCurrentStep("payment");
    window.scrollTo(0, 0);
  };

  const handlePaymentComplete = async (paymentStatus: string, referenceInfo?: Record<string, string>) => {
    if (!formData) return;
    
    setIsProcessing(true);
    
    try {
      // Show a processing toast
      toast({
        title: "Processing Registration",
        description: "Please wait while we process your registration...",
      });

      // Generate tracking ID for the registration
      const tracking_id = await generateTrackingId();
        // First, handle all registrations
      const registrationPromises = formData.teams.map(async (team, i) => {
        const teamNumber = `Team ${i + 1}`;        const { error } = await supabase.from("registrations").insert({
          id: tracking_id, // Use tracking_id as the primary key
          company_name: formData.companyName,
          team_number: teamNumber,
          player1_name: team.player1.name,
          player2_name: team.player2.name,
          captain_name: formData.captainName,
          payment_status: paymentStatus
        });
        
        if (error) {
          console.error("Error inserting registration data:", error);
          throw error;
        }
        return true;
      });

      // Wait for all registrations to complete
      await Promise.all(registrationPromises);

      // After successful registration, try to send emails
      try {
        await sendRegistrationEmail({ ...formData, tracking_id });
      } catch (emailError) {
        console.error("Error sending confirmation emails:", emailError);
        // Don't throw error for email failure, just show warning
        toast({
          title: "Email Delivery Issue",
          description: "Registration is complete, but there was an issue sending the confirmation email. Your tracking ID is: " + tracking_id,
          variant: "warning",
        });
      }
      
      await Promise.all(registrationPromises);
      
      // Update form data with payment status and tracking ID
      setFormData({
        ...formData,
        tracking_id,
        paymentDetails: {
          ...formData.paymentDetails,
          status: paymentStatus === "Paid" ? "completed" : "pending"
        }
      });
      
      // Show success toast for registration
      toast({
        title: "Registration Successful",
        description: `Your registration is complete! Your tracking ID is: ${tracking_id}. ${
          paymentStatus === "Paid"
            ? "Payment has been completed successfully."
            : "Please complete the payment with the selected committee member."
        }`,
      });
      
      // Proceed to receipt
      setCurrentStep("receipt");
      window.scrollTo(0, 0);    } catch (error) {
      console.error("Registration processing error:", error);
      
      // Show error toast but with specific message for different payment types
      toast({
        title: "Registration Failed",
        description: paymentStatus === "Pending"
          ? "There was an issue saving your registration. Please try again or contact support."
          : "There was an error processing your registration and payment. Please try again.",
        variant: "destructive",
      });
      
      // Don't proceed to receipt page if there was an error
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  // Reference to committee members (needs to be in scope for the payment handler)
  const committeeMembers = [
    { id: '1', name: 'Sanjay Lakhotia', designation: 'Committee Member', phone: '' },
    { id: '2', name: 'Vikram Poddar', designation: 'Committee Member', phone: '' },
    { id: '3', name: 'Rajesh Kankaria', designation: 'Committee Member', phone: '' },
    { id: '4', name: 'Prashant Mehra', designation: 'Committee Member', phone: '' },
    { id: '5', name: 'Timir Roy', designation: 'Committee Member', phone: '' },
    { id: '6', name: 'Chandan Shroff', designation: 'Committee Member', phone: '' },
    { id: '7', name: 'Somenath Chatterjee', designation: 'Committee Member', phone: '' },
    { id: '8', name: 'Devesh Srivastava', designation: 'Committee Member', phone: '' },
    { id: '9', name: 'Samit Malhotra', designation: 'Committee Member', phone: '' },
    { id: '10', name: 'Agnesh Kumar Verma', designation: 'Committee Member', phone: '' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                alt="Merchant Cup Logo"
                src={logoPath}
                className="w-14 h-14 rounded-lg shadow-sm object-cover"
              />
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  38th Merchants Cup 2025-26
                </h1>
                <p className="text-sm text-gray-600">RCGC Bowling Section</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-700">Royal Calcutta Golf Club</p>
                <p className="text-xs text-gray-500">Bowling Section</p>
              </div>
              <img 
                src={rcgcLogoPath}
                alt="RCGC Logo"
                className="w-12 h-12 rounded-lg shadow-sm object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === "form" && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <RegistrationForm onSubmit={handleFormSubmit} isProcessing={isProcessing} />
          </div>
        )}
        
        {currentStep === "payment" && formData && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <PaymentSelection 
              formData={formData} 
              onComplete={handlePaymentComplete} 
            />
          </div>
        )}
        
        {currentStep === "receipt" && formData && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <ReceiptPage data={formData} />
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md border border-green-200 inline-flex items-center gap-2 text-sm">
            <CheckCircle className="text-green-500" size={18} />
            <span>Connected to database</span>
          </div>
        </div>
      </main>

      <footer className="bg-bowlsNavy text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>RCGC Bowling Section</p>          <p className="mt-2 text-sm text-gray-300">
            Venue: RCGC Maidan Tent | Tournament Starts: June 15, 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
