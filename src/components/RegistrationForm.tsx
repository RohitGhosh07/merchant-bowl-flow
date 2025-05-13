
import { useState } from "react";
import { FormData, Team } from "@/types/formTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, CheckIcon, Trash2, UserPlus, LoaderCircle } from "lucide-react";

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void;
  isProcessing?: boolean;
}

const RegistrationForm = ({ onSubmit, isProcessing = false }: RegistrationFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",    
    teams: [
      {
        player1: { name: "", mobile: "", email: "", role: "captain" },
        player2: { name: "", mobile: "", email: "", role: "player" },
        player3: { name: "", mobile: "", email: "", role: "player" }
      }
    ],
    paymentDetails: {
      method: "online",
      status: "paid", // Changed to paid by default since we're removing payment flow
      amount: 8850,
      paymentDate: new Date().toISOString(),
    },
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
            player1: { name: "", mobile: "", email: "", role: "captain" },
            player2: { name: "", mobile: "", email: "", role: "player" },
            player3: { name: "", mobile: "", email: "", role: "player" }
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.companyName.trim() || !formData.contactPhone.trim() || !formData.contactEmail.trim() || !formData.address.trim()) {
          toast({
            title: "Missing Information",
            description: "Please fill in all the required fields.",
            variant: "destructive",
          });
          return false;
        }
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(formData.contactPhone)) {
          toast({
            title: "Invalid Phone Number",
            description: "Please enter a valid 10-digit phone number.",
            variant: "destructive",
          });
          return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.contactEmail)) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 1:
        let valid = true;
        formData.teams.forEach((team, index) => {
          if (!team.player1.name || !team.player1.mobile || 
              !team.player2.name || !team.player2.mobile ||
              !team.player3.name || !team.player3.mobile) {
            toast({
              title: "Missing Players Information",
              description: `Please complete player details for Team ${index + 1}. Each team requires 3 players.`,
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
    if (validateStep(currentStep)) {
      formData.paymentDetails.status = "paid";
      onSubmit(formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <h3 className="font-medium text-gray-700 mb-4">Company Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName" className="text-gray-700 font-medium">Company Name*</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-gray-700 font-medium">Company Address*</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your company address"
                    className="mt-1.5"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <h3 className="font-medium text-gray-700 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactPhone" className="text-gray-700 font-medium">Contact Phone*</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    className="mt-1.5"
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-gray-700 font-medium">Contact Email*</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="mt-1.5"
                    type="email"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            {formData.teams.map((team, teamIndex) => (
              <div key={teamIndex} className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">Team {teamIndex + 1}</h3>
                  {formData.teams.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTeam(teamIndex)}
                      className="flex items-center gap-1.5"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`player1-name-${teamIndex}`} className="text-gray-700">Player 1 Name*</Label>
                      <Input
                        id={`player1-name-${teamIndex}`}
                        value={team.player1.name}
                        onChange={(e) => updateTeamMember(teamIndex, "player1", "name", e.target.value)}
                        placeholder="Enter player name"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`player1-mobile-${teamIndex}`} className="text-gray-700">Player 1 Mobile*</Label>
                      <Input
                        id={`player1-mobile-${teamIndex}`}
                        value={team.player1.mobile}
                        onChange={(e) => updateTeamMember(teamIndex, "player1", "mobile", e.target.value)}
                        placeholder="Enter mobile number"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`player1-email-${teamIndex}`} className="text-gray-700">Player 1 Email</Label>
                      <Input
                        id={`player1-email-${teamIndex}`}
                        value={team.player1.email || ""}
                        onChange={(e) => updateTeamMember(teamIndex, "player1", "email", e.target.value)}
                        type="email"
                        placeholder="Enter email address"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`player2-name-${teamIndex}`} className="text-gray-700">Player 2 Name*</Label>
                      <Input
                        id={`player2-name-${teamIndex}`}
                        value={team.player2.name}
                        onChange={(e) => updateTeamMember(teamIndex, "player2", "name", e.target.value)}
                        placeholder="Enter player name"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`player2-mobile-${teamIndex}`} className="text-gray-700">Player 2 Mobile*</Label>
                      <Input
                        id={`player2-mobile-${teamIndex}`}
                        value={team.player2.mobile}
                        onChange={(e) => updateTeamMember(teamIndex, "player2", "mobile", e.target.value)}
                        placeholder="Enter mobile number"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`player2-email-${teamIndex}`} className="text-gray-700">Player 2 Email</Label>
                      <Input
                        id={`player2-email-${teamIndex}`}
                        value={team.player2.email || ""}
                        onChange={(e) => updateTeamMember(teamIndex, "player2", "email", e.target.value)}
                        type="email"
                        placeholder="Enter email address"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`player3-name-${teamIndex}`} className="text-gray-700">Player 3 Name*</Label>
                      <Input
                        id={`player3-name-${teamIndex}`}
                        value={team.player3.name}
                        onChange={(e) => updateTeamMember(teamIndex, "player3", "name", e.target.value)}
                        placeholder="Enter player name"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`player3-mobile-${teamIndex}`} className="text-gray-700">Player 3 Mobile*</Label>
                      <Input
                        id={`player3-mobile-${teamIndex}`}
                        value={team.player3.mobile}
                        onChange={(e) => updateTeamMember(teamIndex, "player3", "mobile", e.target.value)}
                        placeholder="Enter mobile number"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`player3-email-${teamIndex}`} className="text-gray-700">Player 3 Email</Label>
                      <Input
                        id={`player3-email-${teamIndex}`}
                        value={team.player3.email || ""}
                        onChange={(e) => updateTeamMember(teamIndex, "player3", "email", e.target.value)}
                        type="email"
                        placeholder="Enter email address"
                        className="mt-1.5"
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
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5"
              >
                <UserPlus size={18} />
                <span>Add Another Team</span>
              </Button>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-gray-700 text-sm">
                Registration Fee: <span className="font-bold">₹8,850</span> per team
              </p>
              <p className="text-gray-700 font-bold mt-2">
                Total Amount: ₹{formData.totalAmount}
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="captainName" className="text-gray-700 font-medium">Captain's Name*</Label>
              <Input
                id="captainName"
                name="captainName"
                value={formData.captainName}
                onChange={handleInputChange}
                placeholder="Enter captain's name"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="designation" className="text-gray-700 font-medium">Designation*</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Enter designation"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-gray-700 font-medium">Date*</Label>
              <div className="relative">
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1.5"
                  required
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
              <h3 className="font-medium mb-3 text-gray-700">Tournament Rules and Regulations</h3>
              <div className="text-sm text-gray-600 h-40 overflow-y-auto p-3 border border-slate-200 rounded-md bg-white mb-4">
                <p className="font-semibold mb-2">TEAM</p>
                <p>• A team consists of three players called LEAD, SECOND and SKIP, in which the Lead bowls first followed by Second and then Skip.</p>
                <p>• Teams must have at least one playing member from the participating company.</p>
                <p>• Each player rolls four woods each.</p>
                <p>• Before the start of the game, two practice ends with two woods each player shall be allowed.</p>
                
                <p className="font-semibold mt-4 mb-2">TEAM HANDICAP</p>
                <p>• The team Handicap shall be ascertained by taking into account the handicap of the two best players of the team.</p>
                <p>• This handicap shall remain unchanged for the entire tournament.</p>
                <p>• The committee reserves the right to alter the handicap of a team at any given time during the tournament.</p>
                
                <p className="font-semibold mt-4 mb-2">WALKOVER</p>
                <p>• If a team is not present 30 minutes after the scheduled match timing then the opponent will get a walkover.</p>
                <p>• In case both the teams are not present, then the opponent of the next round gets a bye.</p>
              </div>

              <h3 className="font-medium mb-3 text-gray-700 mt-6">Code of Etiquette</h3>
              <div className="text-sm text-gray-600 h-40 overflow-y-auto p-3 border border-slate-200 rounded-md bg-white mb-4">
                <p>BOWLS is perhaps one of the most sociable games that one can play - its very pace allows for friendship to be quickly established which are often enduring. The game has its own charm and attracts people from all walks of life.</p>
                
                <p className="mt-4">The code of etiquette observed by bowlers ensure that in no circumstances does one bowler have an obvious or unfair advantage over another. On the green all players are regarded equal.</p>
                
                <p className="mt-4 mb-2">Key Points to Observe:</p>
                <p>• Always be on time for matches and dress correctly.</p>
                <p>• Stand still and remain quiet when the players are about to deliver.</p>
                <p>• Remain behind the mat or the head when it isn't your turn to play.</p>
                <p>• Keep to your own rink, being aware of shadows on a sunny day or under lights.</p>
                <p>• Avoid obscuring any of the rink markers or boundary pegs.</p>
                <p>• Pay attention to what is going on during the game and particularly to your skip's instructions.</p>
                <p>• Smoking, Drinking and consumption of food or gutka is not allowed on the Playing Greens.</p>
                <p>• Prompting or advicing is NOT ALLOWED from outside the Greens other than their own team members.</p>
                <p>• Only players and officials are allowed to enter the green and the demarcated area.</p>
                <p>• Never openly criticize and always appear to be enjoying the game - despite your misfortunes.</p>
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
            
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
              <h3 className="font-medium text-lg mb-3 text-gray-700">Registration Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{formData.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p className="font-medium">{formData.contactPhone}</p>
                  <p className="text-sm text-gray-600">{formData.contactEmail}</p>
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
                  <p className="font-medium text-blue-600">₹{formData.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        );
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
