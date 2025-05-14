import { FormData } from "@/types/formTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CompanyInfoStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CompanyInfoStep = ({ formData, handleInputChange }: CompanyInfoStepProps) => {
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
          </div>          <div>
            <Label htmlFor="gstNumber" className="text-gray-700 font-medium">GST Number (optional)</Label>
            <Input
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              placeholder="Enter your GST number (if applicable)"
              className="mt-1.5"
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
};

export default CompanyInfoStep;
