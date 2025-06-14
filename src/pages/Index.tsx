import { useState } from "react";
import { Link } from "react-router-dom";
import RegistrationForm from "@/components/RegistrationForm";
import { FormData } from "@/types/formTypes";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Calendar, Users, MapPin, Clock } from "lucide-react";
import AdminDialog from "@/components/admin/AdminDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReceiptPage from "@/components/ReceiptPage";
import PaymentSelection from "@/components/PaymentSelection";
import { sendRegistrationEmail } from "@/services/emailService";
import { generateTrackingId } from "@/utils/trackingId";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import logo paths and account for base path
const logoPath = import.meta.env.BASE_URL + 'logo.jpeg';
const rcgcLogoPath = import.meta.env.BASE_URL + 'rcgc.jpeg';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "receipt">("form");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Form is closed - show closed message instead of registration form
  const isFormClosed = true;

  const handleFormSubmit = async (data: FormData) => {
    // This function is kept for potential future use but won't be called when form is closed
    setIsProcessing(true);
    try {
      const tracking_id = await generateTrackingId();
      
      // First save to database with pending status
      const registrationPromises = data.teams.map(async (team, i) => {
        const teamNumber = `Team ${i + 1}`;
        
        try {
          const { error } = await supabase.from("registrations").insert({
            id: tracking_id,
            company_name: data.companyName,
            team_number: teamNumber,
            player1_name: team.player1.name,
            player2_name: team.player2.name,
            player3_name: team.player3.name || null,
            player1_mobile: team.player1.mobile || null,
            player2_mobile: team.player2.mobile || null,
            player3_mobile: team.player3.mobile || null,
            player1_email: team.player1.email || null,
            player2_email: team.player2.email || null,
            player3_email: team.player3.email || null,
            captain_name: data.captainName,
            captain_phone: data.contactPhone,
            captain_email: data.contactEmail,
            payment_status: "Pending",
            amount: 10030,
            gst_number: data.gstNumber || null,
            registration_status: "active",
            contact_phone: data.contactPhone,
            contact_email: data.contactEmail,
            contact_address: data.address,
            captain_designation: data.designation
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

      await Promise.all(registrationPromises);
      
      const updatedData = {
        ...data,
        totalAmount: 10030,
        tracking_id: tracking_id
      };
      
      setFormData(updatedData);
      setCurrentStep("payment");
      window.scrollTo(0, 0);

      toast({
        title: "Registration Saved",
        description: "Your registration has been saved. Please proceed with payment.",
      });
    } catch (error) {
      console.error("Error saving registration:", error);
      toast({
        title: "Registration Error",
        description: "There was an error saving your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentComplete = async (paymentStatus: string, referenceInfo?: Record<string, any>) => {
    if (!formData || !formData.tracking_id) return;
    
    setIsProcessing(true);
    
    try {
      toast({
        title: "Processing Payment",
        description: "Please wait while we update your payment status...",
      });

      const updateObj: any = {
        payment_status: paymentStatus,
        payment_method: paymentStatus === "Online" ? "online" : "offline",
        referred_name: referenceInfo?.referred_name || null,
        payment_date: paymentStatus === "Online" ? new Date().toISOString() : null
      };

      if (paymentStatus === "Pending" && referenceInfo?.committee_member) {
        updateObj.committee_member = referenceInfo.committee_member;
      }

      const { error } = await supabase
        .from("registrations")
        .update(updateObj)
        .eq('id', formData.tracking_id);
      
      if (error) {
        console.error("Error updating payment status:", error);
        throw error;
      }

      try {
        await sendRegistrationEmail(formData);
      } catch (emailError) {
        console.error("Error sending confirmation emails:", emailError);
        toast({
          title: "Email Delivery Issue",
          description: "Registration is complete, but there was an issue sending the confirmation email. Your tracking ID is: " + formData.tracking_id,
          variant: "warning",
        });
      }
      
      setFormData({
        ...formData,
        paymentDetails: {
          ...formData.paymentDetails,
          status: paymentStatus === "Paid" ? "completed" : "pending",
          committeeMember: paymentStatus === "Pending" && referenceInfo?.committeeMember ? 
            committeeMembers.find(member => member.name === referenceInfo.committeeMember) || undefined : undefined,
          referredBy: referenceInfo?.referredBy || undefined
        }
      });

      toast({
        title: "Registration Successful",
        description: `Your registration is complete! Your tracking ID is: ${formData.tracking_id}. ${
          paymentStatus === "Online"
            ? "You will now be redirected to complete the payment."
            : "Please complete the payment with the selected committee member."
        }`,
        variant: "success"
      });
      
      if (paymentStatus === "Pending") {
        setCurrentStep("receipt");
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Registration processing error:", error);
      
      toast({
        title: "Registration Failed",
        description: paymentStatus === "Pending"
          ? "There was an issue saving your registration. Please try again or contact support."
          : "There was an error processing your registration and payment. Please try again.",
        variant: "destructive",
      });
      return;
    } finally {
      setIsProcessing(false);
    }
  };

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
        {isFormClosed ? (
          // Form Closed UI
          <div className="space-y-8">
            {/* Main Closed Message Card */}
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                      <Clock className="w-10 h-10 text-red-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-red-800 mb-2">
                  Registration Closed
                </CardTitle>
                <p className="text-lg text-red-700">
                  The registration period for the 38th Merchants Cup 2025-26 has ended.
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-white/70 rounded-lg p-6 border border-red-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Thank you for your interest!
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We have received an overwhelming response for this year's tournament. 
                    Registration closed on the scheduled date and we are no longer accepting new team registrations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-white/70 rounded-lg p-4 border border-red-200">
                    <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-800">Venue</h4>
                    <p className="text-sm text-gray-600 mt-1">RCGC Maidan Tent</p>
                  </div>
                </div>

                
              </CardContent>
            </Card>

            
            {/* Contact Information Card */}
            <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 text-center">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-700">
                  For any queries regarding the tournament, please contact:
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">RCGC Tournament Committee</p>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Original form content (hidden when isFormClosed is true)
          <>
            {currentStep === "form" && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <RegistrationForm onSubmit={handleFormSubmit} isProcessing={isProcessing} />
              </div>
            )}
              
            {currentStep === "payment" && formData && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <PaymentSelection 
                  formData={formData} 
                  registrationId={formData.tracking_id}
                  onComplete={handlePaymentComplete} 
                />
              </div>
            )}
            
            {currentStep === "receipt" && formData && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <ReceiptPage data={formData} />
              </div>
            )}
          </>
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
            Venue: RCGC Maidan Tent | Tournament Starts: June 15, 2025
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdminOpen(true)}
              className="bg-transparent text-white border-white hover:bg-white hover:text-bowlsNavy transition-colors"
            >
              <Lock className="w-4 h-4 mr-2" />
              Admin Access
            </Button>
          </div>
        </div>

        <AdminDialog open={isAdminOpen} onOpenChange={setIsAdminOpen} />
      </footer>
    </div>
  );
};

export default Index;