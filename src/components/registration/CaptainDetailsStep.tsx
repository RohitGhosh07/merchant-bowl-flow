
import { FormData } from "@/types/formTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";

interface CaptainDetailsStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CaptainDetailsStep = ({ formData, handleInputChange }: CaptainDetailsStepProps) => {
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
      </div>      <div>
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
    </div>
  );
};

export default CaptainDetailsStep;
