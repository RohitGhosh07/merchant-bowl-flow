
import { useState } from "react";
import { Link } from "react-router-dom";
import RegistrationForm from "@/components/RegistrationForm";
import PaymentPage from "@/components/PaymentPage";
import ReceiptPage from "@/components/ReceiptPage";
import { FormData } from "@/types/formTypes";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "receipt">("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  
  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentStep("payment");
    window.scrollTo(0, 0);
  };

  const handlePaymentComplete = () => {
    setCurrentStep("receipt");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <header className="bg-bowlsNavy text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-center md:text-left mb-2 md:mb-0">
              37th RCGC Merchants Cup
            </h1>
            <div className="flex items-center gap-4">
              <h2 className="text-lg md:text-xl font-medium text-bowlsGold-light">
                Lawn Bowls Tournament 2024-25
              </h2>
              <Link to="/registrations">
                <Button variant="outline" className="bg-transparent border-white hover:bg-white/10 text-white">
                  View Registrations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentStep === "form" && (
          <RegistrationForm onSubmit={handleFormSubmit} />
        )}
        
        {currentStep === "payment" && formData && (
          <PaymentPage 
            formData={formData} 
            onPaymentComplete={handlePaymentComplete} 
          />
        )}
        
        {currentStep === "receipt" && formData && (
          <ReceiptPage formData={formData} />
        )}
      </main>

      <footer className="bg-bowlsNavy text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>RCGC Bowling Section</p>
          <p className="mt-2 text-sm text-gray-300">
            Venue: RCGC Maidan Pavilion | Tournament Starts: May 9, 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
