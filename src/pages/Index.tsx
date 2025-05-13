
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
            payment_status: paymentStatus
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
      
      // Update form data with payment status and reference info
      setFormData({
        ...formData,
        paymentDetails: {
          ...formData.paymentDetails,
          status: paymentStatus === "Paid" ? "completed" : "pending",
          ...(referenceInfo && {
            committeeMember: { 
              id: "custom", 
              name: referenceInfo.committeeMember, 
              designation: "Committee Member", 
              phone: "" 
            },
            referredBy: referenceInfo.referredBy
          })
        }
      });
      
      // Show success toast for registration
      toast({
        title: "Registration Successful",
        description: paymentStatus === "Paid" 
          ? "Your registration and payment have been completed successfully." 
          : "Your registration has been submitted. Please complete the payment with the selected committee member.",
      });
      
      // Proceed to receipt
      setCurrentStep("receipt");
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Registration processing error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
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
      <header className="bg-white border-b py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <img 
                  src="/logo.jpeg" 
                  alt="Merchant Cup Logo" 
                  className="w-12 h-12 rounded-lg shadow-sm"
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 text-center md:text-left">
                    Merchants Cup
                  </h1>
                  <p className="text-sm text-gray-500 hidden md:block">RCGC Bowling Section</p>
                </div>
              </div>
              <div className="border-l h-12 border-gray-200"></div>
              <img 
                src="/rcgc.jpeg" 
                alt="RCGC Logo" 
                className="w-10 h-10 rounded-full shadow-sm hidden md:block"
              />
            </div>
            <div className="flex items-center gap-6">
              <h2 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Lawn Bowls Tournament 2025
              </h2>
              <Link to="/registrations">
                <Button variant="outline" className="bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors">
                  View Registrations
                </Button>
              </Link>
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
          <p>RCGC Bowling Section</p>
          <p className="mt-2 text-sm text-gray-300">
            Venue: RCGC Maidan Pavilion | Tournament Starts: May 9, 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
