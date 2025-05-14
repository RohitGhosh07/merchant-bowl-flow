
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle } from "lucide-react";

interface RegistrationData {
  id: string;
  created_at: string;
  company_name: string;
  team_number: string;
  player1_name: string;
  player2_name: string;
  captain_name: string;
  payment_status: string;
}

const Registrations = () => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "error">("connected");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("registrations")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setRegistrations(data || []);
        setConnectionStatus("connected");
      } catch (error) {
        console.error("Error fetching registrations:", error);
        setError("Failed to load registrations. Please try again later.");
        setConnectionStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <header className="bg-bowlsNavy text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-center md:text-left mb-2 md:mb-0">
              38th Merchants Cup 2025-26
            </h1>
            <div className="flex items-center gap-4">
              <h2 className="text-lg md:text-xl font-medium text-bowlsGold-light">
                Team Registrations
              </h2>
              <Link to="/">
                <Button variant="outline" className="bg-transparent border-white hover:bg-white/10 text-white">
                  Back to Registration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-bowlsNavy">
              Registered Teams
            </h2>
            <p className="text-gray-600">
              View all team registrations for the tournament.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2">
              {connectionStatus === "connected" ? (
                <>
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm font-medium">Connected to Supabase</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" size={20} />
                  <span className="text-sm font-medium">Database connection error</span>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-6">
                <XCircle className="text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-medium text-red-700 mb-2">Connection Error</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : registrations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Registrations Yet</h3>
                <p className="text-gray-500">Teams will appear here once they register for the tournament.</p>
                <Link to="/" className="mt-4">
                  <Button className="bg-bowlsGreen hover:bg-bowlsGreen-dark">
                    Register a Team
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg) => (
              <Card key={reg.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-bowlsNavy/90 text-white py-3 px-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{reg.company_name}</span>
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      reg.payment_status === "Paid" 
                        ? "bg-green-700/80 text-white" 
                        : "bg-yellow-700/80 text-white"
                    }`}>
                      {reg.payment_status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Team</p>
                      <p className="text-sm font-bold">{reg.team_number}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Player 1</p>
                      <p className="text-sm">{reg.player1_name}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Player 2</p>
                      <p className="text-sm">{reg.player2_name}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Captain</p>
                      <p className="text-sm">{reg.captain_name}</p>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Registration Date</p>
                      <p className="text-sm">
                        {new Date(reg.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short', 
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-bowlsNavy text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>RCGC Bowling Section</p>
          <p className="mt-2 text-sm text-gray-300">
            Venue: RCGC Maidan Pavilion | Tournament Starts: May 9, 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Registrations;
