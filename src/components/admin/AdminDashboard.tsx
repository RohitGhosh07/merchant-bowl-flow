import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Edit2,
  Trash2,
  Search,
  LogOut,
  FileDown,
  RefreshCw,
  AlertTriangle,
  Database,
} from "lucide-react";

interface Registration {
  id: string;
  company_name: string;
  team_number: string;
  player1_name: string;
  player2_name: string;
  captain_name: string;
  payment_status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem("adminAuthenticated");
      if (!isAuthenticated) {
        navigate("/admin");
      }
    };
    checkAuth();
    fetchRegistrations();
  }, [navigate]);

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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin");
  };

  const handleEdit = async (registration: Registration) => {
    try {
      const { error } = await supabase
        .from("registrations")
        .update({
          company_name: registration.company_name,
          player1_name: registration.player1_name,
          player2_name: registration.player2_name,
          captain_name: registration.captain_name,
          payment_status: registration.payment_status,
        })
        .eq("id", registration.id);

      if (error) throw error;
      toast.success("Registration updated successfully");
      fetchRegistrations();
      setEditingRegistration(null);
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Failed to update registration");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
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
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Company Name",
      "Team Number",
      "Captain Name",
      "Player 1",
      "Player 2",
      "Payment Status",
      "Registration Date",
    ];

    const csvData = registrations.map((reg) => [
      reg.company_name,
      reg.team_number,
      reg.captain_name,
      reg.player1_name,
      reg.player2_name,
      reg.payment_status,
      new Date(reg.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join(
      "\n"
    );

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
        "⚠️ WARNING: This will delete ALL registrations. This action cannot be undone. Are you absolutely sure?"
      )
    ) {
      return;
    }
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .not("id", "is", null);

      if (error) throw error;
      toast.success("All registrations cleared successfully");
      fetchRegistrations();
    } catch (error) {
      console.error("Error clearing registrations:", error);
      toast.error("Failed to clear registrations");
    }
  };

  const filteredRegistrations = registrations.filter((reg) =>
    Object.values(reg).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage tournament registrations</p>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{registrations.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Paid Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {registrations.filter((r) => r.payment_status === "Paid").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {registrations.filter((r) => r.payment_status === "Pending").length}
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
                  <TableCell className="font-medium">{registration.company_name}</TableCell>
                  <TableCell>{registration.team_number}</TableCell>
                  <TableCell>{registration.captain_name}</TableCell>
                  <TableCell>
                    {registration.player1_name}, {registration.player2_name}
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
                                <label className="text-sm font-medium">Company Name</label>
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
                                <label className="text-sm font-medium">Payment Status</label>
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
                              <Button onClick={() => handleEdit(editingRegistration)}>
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
    </div>
  );
};

export default AdminDashboard;
