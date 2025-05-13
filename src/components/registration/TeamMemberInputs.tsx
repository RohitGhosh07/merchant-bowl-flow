
import { Team } from "@/types/formTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TeamMemberInputsProps {
  team: Team;
  teamIndex: number;
  updateTeamMember: (
    teamIndex: number,
    role: "player1" | "player2" | "player3",
    field: "name" | "mobile" | "email",
    value: string
  ) => void;
}

const TeamMemberInputs = ({ team, teamIndex, updateTeamMember }: TeamMemberInputsProps) => {
  return (
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
  );
};

export default TeamMemberInputs;
