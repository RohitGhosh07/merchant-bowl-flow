import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  LogOut,
  Search,
  FileDown,
  RefreshCw,
  Database,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminDashboardProps {
  onClose: () => void;
}

interface Registration {
  id: string;
  company_name: string;
  team_number: string;
  captain_name: string;
  contact_phone: string;
  payment_status: string;
  amount: number;
  payment_reference?: string;
  player1_name?: string;
  player2_name?: string;
  player3_name?: string;
  created_at?: string;
}

interface PaymentResponse {
  success: boolean;
  data: {
    status: string;
    payment_status: string;
    transaction_id: string;
    member_name: string;
    amount: string;
    transaction_date: string;
  };
}

const AdminDashboard = ({ onClose }: AdminDashboardProps) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    onClose();
  };

  const filteredRegistrations = registrations.filter((reg) =>
    Object.values(reg).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Company Name",
      "Team",
      "Captain",
      "Contact Phone",
      "Payment Status",
      "Amount",
      "Player 1",
      "Player 2",
      "Player 3",
    ];

    const csvContent = [
      headers.join(","),
      ...registrations.map((reg) =>
        [
          reg.id,
          reg.company_name,
          reg.team_number,
          reg.captain_name,
          reg.contact_phone,
          reg.payment_status,
          reg.amount,
          reg.player1_name,
          reg.player2_name,
          reg.player3_name,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearAllRegistrations = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all registrations? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .neq("id", "0"); // Delete all records

      if (error) throw error;

      toast.success("All registrations cleared successfully");
      fetchRegistrations();
    } catch (error) {
      console.error("Error clearing registrations:", error);
      toast.error("Failed to clear registrations");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Registration deleted successfully");
      fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast.error("Failed to delete registration");
    }
  };

  const handleEdit = async (registration: Registration) => {
    try {
      const { error } = await supabase
        .from("registrations")
        .update({
          company_name: registration.company_name,
          payment_status: registration.payment_status,
        })
        .eq("id", registration.id);

      if (error) throw error;

      toast.success("Registration updated successfully");
      setEditingRegistration(null);
      fetchRegistrations();
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Failed to update registration");
    }
  };

  const checkPaymentStatus = async (
    phoneNumber: string,
    registrationId: string
  ) => {
    try {
      const response = await fetch(
        `https://rcgcbooking.in/ccavenue_pg_v2/make_payment_merchant.php?action=get_payment_details&phone_number=${phoneNumber}`
      );
      const data: PaymentResponse = await response.json();

      if (data.success && data.data) {
        const { error } = await supabase
          .from("registrations")
          .update({
            payment_status: data.data.payment_status,
            payment_reference: data.data.transaction_id,
            payment_date: data.data.transaction_date,
          })
          .eq("id", registrationId);

        if (error) throw error;

        toast.success("Payment status updated successfully");
        fetchRegistrations();
      } else {
        toast.error("No payment record found");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error("Failed to check payment status");
    }
  };

  if (loading) {
    return <div className="p-4">Loading registrations...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage tournament registrations
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Total Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{registrations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Paid Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {registrations.filter((r) => r.payment_status === "Paid").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {registrations.filter((r) => r.payment_status === "Pending")
                .length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-4 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={downloadCSV}
              className="gap-2 flex-1 md:flex-none"
            >
              <FileDown className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={fetchRegistrations}
              className="gap-2 flex-1 md:flex-none"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={clearAllRegistrations}
              className="gap-2 flex-1 md:flex-none"
            >
              <Database className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Captain</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">
                  {registration.company_name}
                </TableCell>
                <TableCell>{registration.team_number}</TableCell>
                <TableCell>{registration.captain_name}</TableCell>
                <TableCell>
                  {registration.player1_name}, {registration.player2_name}
                  {registration.player3_name && `, ${registration.player3_name}`}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.payment_status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {registration.payment_status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRegistration(registration)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Registration</DialogTitle>
                        </DialogHeader>
                        {editingRegistration && (
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="text-sm font-medium">
                                Company Name
                              </label>
                              <Input
                                value={editingRegistration.company_name}
                                onChange={(e) =>
                                  setEditingRegistration({
                                    ...editingRegistration,
                                    company_name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Payment Status
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 p-2"
                                value={editingRegistration.payment_status}
                                onChange={(e) =>
                                  setEditingRegistration({
                                    ...editingRegistration,
                                    payment_status: e.target.value,
                                  })
                                }
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </div>
                            <Button
                              onClick={() => handleEdit(editingRegistration)}
                              className="w-full"
                            >
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        checkPaymentStatus(
                          registration.contact_phone,
                          registration.id
                        )
                      }
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(registration.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
