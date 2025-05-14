
import { useState } from "react";
import { FormData, Team } from "@/types/formTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon, LoaderCircle } from "lucide-react";

// Import the form steps
import CompanyInfoStep from "./registration/CompanyInfoStep";
import TeamDetailsStep from "./registration/TeamDetailsStep";
import CaptainDetailsStep from "./registration/CaptainDetailsStep";
import ReviewConfirmStep from "./registration/ReviewConfirmStep";
import { validateStep } from "@/utils/formValidation";

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void;
  isProcessing?: boolean;
}

const RegistrationForm = ({ onSubmit, isProcessing = false }: RegistrationFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({    companyName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    gstNumber: "",
    teams: [
      {
        player1: { name: "", mobile: "", email: "", role: "captain" },
        player2: { name: "", mobile: "", email: "", role: "player" },
        player3: { name: "", mobile: "", email: "", role: "player" }
      }
    ],
    paymentDetails: {
      method: "online",
      status: "completed", // Changed to completed to fix TypeScript error
      amount: 8850,
      paymentDate: new Date().toISOString(),
    },
    captainName: "",
    designation: "",    rulesAccepted: false,
    numTeams: 1,
    totalAmount: 10030 // Fixed amount
  });

  const updateTeamMember = (
    teamIndex: number,
    role: "player1" | "player2" | "player3",
    field: "name" | "mobile" | "email",
    value: string
  ) => {
    const newTeams = [...formData.teams];
    newTeams[teamIndex] = {
      ...newTeams[teamIndex],
      [role]: {
        ...newTeams[teamIndex][role],
        [field]: value
      }
    };
    setFormData({ ...formData, teams: newTeams });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, rulesAccepted: checked });
  };

  const nextStep = () => {
    if (validateStep(currentStep, formData, toast)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep, formData, toast)) {
      formData.paymentDetails.status = "completed";
      onSubmit(formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyInfoStep formData={formData} handleInputChange={handleInputChange} />;
      case 1:
        return <TeamDetailsStep 
                 formData={formData} 
                 setFormData={setFormData}
                 updateTeamMember={updateTeamMember} 
               />;
      case 2:
        return <CaptainDetailsStep formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <ReviewConfirmStep formData={formData} handleCheckboxChange={handleCheckboxChange} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Team Registration
          </h2>
          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step + 1}
                  </div>
                  {step < 3 && (
                    <div 
                      className={`w-6 h-0.5 ${
                        currentStep > step ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-500">
          Please complete all required fields marked with an asterisk (*).
        </p>
      </div>

      <Card className="border shadow">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-xl">
            {currentStep === 0 && "Company Information"}
            {currentStep === 1 && "Team Details"}
            {currentStep === 2 && "Captain Details"}
            {currentStep === 3 && "Review & Confirm"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isProcessing}
          >
            Previous
          </Button>
        )}
        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="ml-auto bg-blue-600 hover:bg-blue-700"
            disabled={isProcessing}
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            className="ml-auto bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default RegistrationForm;
