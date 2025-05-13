
import { FormData } from "@/types/formTypes";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import TeamMemberInputs from "./TeamMemberInputs";
import { useToast } from "@/hooks/use-toast";

interface TeamDetailsStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  updateTeamMember: (
    teamIndex: number,
    role: "player1" | "player2" | "player3",
    field: "name" | "mobile" | "email",
    value: string
  ) => void;
}

const TeamDetailsStep = ({ 
  formData, 
  setFormData,
  updateTeamMember 
}: TeamDetailsStepProps) => {
  const { toast } = useToast();

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
          
          <TeamMemberInputs 
            team={team} 
            teamIndex={teamIndex} 
            updateTeamMember={updateTeamMember}
          />
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
};

export default TeamDetailsStep;
