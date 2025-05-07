
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

interface RegistrationData {
  id: string;
  timestamp: string;
  company_name: string;
  team_number: string;
  player1_name: string;
  player2_name: string;
  captain_name: string;
  payment_status: string;
}

const Registrations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkSupabaseConnection();
    fetchRegistrations();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from("registrations").select("count");
      if (error) {
        console.error("Supabase connection error:", error);
        setSupabaseConnected(false);
        toast({
          title: "Connection Error",
          description: "Failed to connect to Supabase database.",
          variant: "destructive",
        });
      } else {
        setSupabaseConnected(true);
        toast({
          title: "Supabase Connected",
          description: "Successfully connected to Supabase database.",
        });
      }
    } catch (error) {
      console.error("Error checking Supabase connection:", error);
      setSupabaseConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Supabase database.",
        variant: "destructive",
      });
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedData = data.map((item: any) => ({
        id: item.id,
        timestamp: item.timestamp || item.created_at,
        company_name: item.company_name,
        team_number: item.team_number,
        player1_name: item.player1_name,
        player2_name: item.player2_name,
        captain_name: item.captain_name,
        payment_status: item.payment_status,
      }));
      
      setRegistrations(formattedData);
      
      toast({
        title: "Registrations Loaded",
        description: `Successfully loaded ${formattedData.length} registrations.`,
      });
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch registrations. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-bowlsNavy">
          Registration Records
        </h1>
        <div className="flex items-center gap-2">
          <span>Supabase Status:</span>
          {supabaseConnected === null ? (
            <span className="text-gray-500">Checking...</span>
          ) : supabaseConnected ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 size={18} />
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <XCircle size={18} />
              <span>Disconnected</span>
            </div>
          )}
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="bg-bowlsGreen text-white">
          <CardTitle>Registrations</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Button 
              onClick={fetchRegistrations}
              disabled={loading}
              className="bg-bowlsGreen hover:bg-bowlsGreen-dark"
            >
              {loading ? "Loading..." : "Refresh Registrations"}
            </Button>
          </div>
          
          {registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Player 1</TableHead>
                    <TableHead>Player 2</TableHead>
                    <TableHead>Captain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.company_name}</TableCell>
                      <TableCell>{reg.team_number}</TableCell>
                      <TableCell>{reg.player1_name}</TableCell>
                      <TableCell>{reg.player2_name}</TableCell>
                      <TableCell>{reg.captain_name}</TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reg.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.payment_status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(reg.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading ? "Loading registrations..." : "No registrations found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Registrations;
