
import { FormData } from "@/types/formTypes";
import { Checkbox } from "@/components/ui/checkbox";

interface ReviewConfirmStepProps {
  formData: FormData;
  handleCheckboxChange: (checked: boolean) => void;
}

const ReviewConfirmStep = ({ formData, handleCheckboxChange }: ReviewConfirmStepProps) => {
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
};

export default ReviewConfirmStep;
