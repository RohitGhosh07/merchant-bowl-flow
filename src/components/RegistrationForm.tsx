
import { useState } from "react";
import { FormData, Team } from "@/types/formTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, CheckIcon } from "lucide-react";
import ReCaptcha from "@/components/ReCaptcha";

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void;
}

const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    address: "",
    teams: [
      {
        player1: { name: "", mobile: "" },
        player2: { name: "", mobile: "" },
        reserve: { name: "", mobile: "" }
      }
    ],
    captainName: "",
    designation: "",
    date: new Date().toISOString().split("T")[0],
    signature: "",
    rulesAccepted: false,
    numTeams: 1,
    totalAmount: 8850 // Price per team
  });

  const addTeam = () => {
    if (formData.teams.length < 3) {
      setFormData({
        ...formData,
        teams: [
          ...formData.teams,
          {
            player1: { name: "", mobile: "" },
            player2: { name: "", mobile: "" },
            reserve: { name: "", mobile: "" }
          }
        ],
        numTeams: formData.numTeams + 1,
        totalAmount: (formData.numTeams + 1) * 8850
      });
    } else {
      toast({
        title: "Maximum Teams Reached",
        description: "You can register up to 3 teams only.",
        variant: "destructive",
      });
    }
  };

  const removeTeam = (index: number) => {
    if (formData.teams.length > 1) {
      const newTeams = formData.teams.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        teams: newTeams,
        numTeams: formData.numTeams - 1,
        totalAmount: (formData.numTeams - 1) * 8850
      });
    } else {
      toast({
        title: "Minimum Teams Required",
        description: "You need to register at least 1 team.",
      });
    }
  };

  const updateTeamMember = (
    teamIndex: number,
    role: "player1" | "player2" | "reserve",
    field: "name" | "mobile",
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, signature: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, rulesAccepted: checked });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.companyName.trim() || !formData.address.trim()) {
          toast({
            title: "Missing Information",
            description: "Please fill in the company name and address.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 1:
        let valid = true;
        formData.teams.forEach((team, index) => {
          if (!team.player1.name || !team.player1.mobile || !team.player2.name || !team.player2.mobile) {
            toast({
              title: "Missing Players Information",
              description: `Please complete player details for Team ${index + 1}.`,
              variant: "destructive",
            });
            valid = false;
          }
        });
        return valid;
      case 2:
        if (!formData.captainName.trim() || !formData.designation.trim() || !formData.date) {
          toast({
            title: "Missing Captain Details",
            description: "Please complete the captain's information.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.rulesAccepted) {
          toast({
            title: "Rules Not Accepted",
            description: "You must accept the tournament rules to proceed.",
            variant: "destructive",
          });
          return false;
        }
        if (!captchaVerified) {
          toast({
            title: "CAPTCHA Not Verified",
            description: "Please verify that you are not a robot.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
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
    if (validateStep(3)) {
      onSubmit(formData);
    }
  };

  const handleCaptchaVerify = () => {
    setCaptchaVerified(true);
    toast({
      title: "CAPTCHA Verified",
      description: "You have successfully verified the CAPTCHA.",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="bg-white shadow-xl border-bowlsGreen">
            <CardHeader className="bg-bowlsGreen text-white rounded-t-md">
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name*</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Company Address*</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your company address"
                    className="mt-1"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card className="bg-white shadow-xl border-bowlsGreen">
            <CardHeader className="bg-bowlsGreen text-white rounded-t-md">
              <CardTitle>Team Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {formData.teams.map((team, teamIndex) => (
                  <div key={teamIndex} className="p-4 border rounded-md bg-green-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Team {teamIndex + 1}</h3>
                      {formData.teams.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTeam(teamIndex)}
                        >
                          Remove Team
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`player1-name-${teamIndex}`}>Player 1 Name*</Label>
                          <Input
                            id={`player1-name-${teamIndex}`}
                            value={team.player1.name}
                            onChange={(e) => updateTeamMember(teamIndex, "player1", "name", e.target.value)}
                            placeholder="Enter player name"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`player1-mobile-${teamIndex}`}>Player 1 Mobile*</Label>
                          <Input
                            id={`player1-mobile-${teamIndex}`}
                            value={team.player1.mobile}
                            onChange={(e) => updateTeamMember(teamIndex, "player1", "mobile", e.target.value)}
                            placeholder="Enter mobile number"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`player2-name-${teamIndex}`}>Player 2 Name*</Label>
                          <Input
                            id={`player2-name-${teamIndex}`}
                            value={team.player2.name}
                            onChange={(e) => updateTeamMember(teamIndex, "player2", "name", e.target.value)}
                            placeholder="Enter player name"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`player2-mobile-${teamIndex}`}>Player 2 Mobile*</Label>
                          <Input
                            id={`player2-mobile-${teamIndex}`}
                            value={team.player2.mobile}
                            onChange={(e) => updateTeamMember(teamIndex, "player2", "mobile", e.target.value)}
                            placeholder="Enter mobile number"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`reserve-name-${teamIndex}`}>Reserve Player Name (Optional)</Label>
                          <Input
                            id={`reserve-name-${teamIndex}`}
                            value={team.reserve?.name || ""}
                            onChange={(e) => updateTeamMember(teamIndex, "reserve", "name", e.target.value)}
                            placeholder="Enter reserve player name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`reserve-mobile-${teamIndex}`}>Reserve Player Mobile (Optional)</Label>
                          <Input
                            id={`reserve-mobile-${teamIndex}`}
                            value={team.reserve?.mobile || ""}
                            onChange={(e) => updateTeamMember(teamIndex, "reserve", "mobile", e.target.value)}
                            placeholder="Enter mobile number"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.teams.length < 3 && (
                  <Button 
                    type="button" 
                    onClick={addTeam} 
                    className="bg-bowlsGold hover:bg-bowlsGold-dark"
                  >
                    Add Another Team
                  </Button>
                )}

                <div className="bg-yellow-50 p-4 rounded-md border border-bowlsGold">
                  <p className="text-bowlsNavy text-sm">
                    Registration Fee: <span className="font-bold">₹8,850</span> per team
                  </p>
                  <p className="text-bowlsNavy font-bold mt-2">
                    Total Amount: ₹{formData.totalAmount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="bg-white shadow-xl border-bowlsGreen">
            <CardHeader className="bg-bowlsGreen text-white rounded-t-md">
              <CardTitle>Captain Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="captainName">Captain's Name*</Label>
                  <Input
                    id="captainName"
                    name="captainName"
                    value={formData.captainName}
                    onChange={handleInputChange}
                    placeholder="Enter captain's name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation*</Label>
                  <Input
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Enter designation"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date*</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signature">Digital Signature (Optional)</Label>
                  <Input
                    id="signature"
                    name="signature"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  {formData.signature && (
                    <div className="mt-2">
                      <p className="text-sm text-green-700">Signature uploaded successfully</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="bg-white shadow-xl border-bowlsGreen">
            <CardHeader className="bg-bowlsGreen text-white rounded-t-md">
              <CardTitle>Confirm Registration</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-2">Registration Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{formData.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teams Registered</p>
                      <p className="font-medium">{formData.numTeams}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Captain</p>
                      <p className="font-medium">{formData.captainName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">₹{formData.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium mb-2">Tournament Rules</h3>
                  <div className="text-sm text-gray-600 h-32 overflow-y-auto p-2 border border-gray-200 rounded mb-4">
                    <p>1. Each team must consist of at least 2 players.</p>
                    <p>2. Players must adhere to the RCGC dress code on the greens.</p>
                    <p>3. Teams must report 15 minutes before their scheduled match time.</p>
                    <p>4. The tournament committee's decision will be final in all matters.</p>
                    <p>5. No refunds will be issued after registration is complete.</p>
                    <p>6. Practice sessions will be available from April 22, 2024.</p>
                    <p>7. All players must be employees of the registered company.</p>
                    <p>8. The tournament schedule will be shared after the registration closes.</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rules"
                      checked={formData.rulesAccepted}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="rules"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the tournament rules and conditions*
                    </label>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <ReCaptcha onVerify={handleCaptchaVerify} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold text-bowlsNavy">
            Registration Form
          </h2>
          <div className="flex items-center space-x-1 text-sm">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 0 ? "bg-bowlsGreen text-white" : "bg-gray-300"
            }`}>
              1
            </div>
            <div className={`w-6 border-t ${currentStep >= 1 ? "border-bowlsGreen" : "border-gray-300"}`}></div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-bowlsGreen text-white" : "bg-gray-300"
            }`}>
              2
            </div>
            <div className={`w-6 border-t ${currentStep >= 2 ? "border-bowlsGreen" : "border-gray-300"}`}></div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-bowlsGreen text-white" : "bg-gray-300"
            }`}>
              3
            </div>
            <div className={`w-6 border-t ${currentStep >= 3 ? "border-bowlsGreen" : "border-gray-300"}`}></div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-bowlsGreen text-white" : "bg-gray-300"
            }`}>
              4
            </div>
          </div>
        </div>
        <p className="text-gray-600">
          Please complete all required fields marked with an asterisk (*).
        </p>
      </div>

      {renderStep()}

      <div className="mt-6 flex justify-between">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="border-bowlsGreen text-bowlsGreen hover:bg-green-50"
          >
            Previous
          </Button>
        )}
        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="ml-auto bg-bowlsGreen hover:bg-bowlsGreen-dark"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            className="ml-auto bg-bowlsGold hover:bg-bowlsGold-dark"
          >
            Proceed to Payment
          </Button>
        )}
      </div>
    </form>
  );
};

export default RegistrationForm;
