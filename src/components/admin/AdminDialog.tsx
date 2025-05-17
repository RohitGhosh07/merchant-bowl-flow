import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminDialog = ({ open, onOpenChange }: AdminDialogProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset auth state when dialog is closed
      setIsAuthenticated(false);
      localStorage.removeItem("adminAuthenticated");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-y-auto">
        {!isAuthenticated ? (
          <AdminLogin onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <AdminDashboard onClose={() => handleOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
