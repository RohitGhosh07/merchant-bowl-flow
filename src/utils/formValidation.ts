import { FormData } from "@/types/formTypes";
import { toast as toastFunction } from "@/hooks/use-toast";

// Define the type for the toast function parameter
type ToastFunction = typeof toastFunction;

export const validateStep = (
  step: number, 
  formData: FormData, 
  toast: ToastFunction
): boolean => {
  switch (step) {
    case 0:      if (!formData.companyName.trim() || !formData.contactPhone.trim() || 
          !formData.contactEmail.trim() || !formData.address.trim() || !formData.gstNumber.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all the required fields including GST number.",
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
      if (!formData.captainName.trim() || !formData.designation.trim()) {
        toast({
          title: "Missing Captain Details",
          description: "Please enter captain's name and designation.",
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
