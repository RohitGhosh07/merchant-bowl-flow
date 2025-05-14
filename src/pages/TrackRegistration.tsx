
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Registration } from "@/types/registration";
import Navbar from "@/components/Navbar";

const TrackRegistration = () => {
  const [trackingId, setTrackingId] = useState("");
  const [registrationData, setRegistrationData] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Format tracking ID as user types
  const handleTrackingIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setTrackingId(value);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {      const { data, error } = await supabase
        .from("registrations")
        .select()
        .eq("id", trackingId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRegistrationData({
          ...data,
          payment_status: data.payment_status as "Paid" | "Pending"
        });
        toast({
          title: "Success",
          description: "Registration details found",
          variant: "success",
        });
      } else {
        toast({
          title: "Not Found",
          description: "No registration found with this tracking ID",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching registration:", error);
      toast({
        title: "Error",
        description: "Failed to fetch registration details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showTrackingButton={false} />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b bg-gray-50/50">
            <CardTitle className="text-2xl">Track Your Registration</CardTitle>
            <CardDescription className="text-base">
              Enter your 6-digit tracking ID to view registration details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Enter 6-digit tracking ID"
                  value={trackingId}
                  onChange={handleTrackingIdChange}
                  maxLength={6}
                  className="flex-1 text-lg tracking-wider text-center font-mono"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  disabled={loading || trackingId.length !== 6}
                  className="w-full sm:w-auto px-8"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            {registrationData && (
              <div className="mt-8 space-y-6">
                <div className="rounded-lg border bg-white p-6 space-y-4 shadow-sm">
                  <div className="grid gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2">
                      <span className="text-lg font-semibold">{registrationData.company_name}</span>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        registrationData.payment_status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {registrationData.payment_status}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Team Details</h3>
                        <div className="mt-1">
                          <p className="font-medium">{registrationData.team_number}</p>
                          <div className="mt-2 space-y-1">
                            <p>Player 1: {registrationData.player1_name}</p>
                            <p>Player 2: {registrationData.player2_name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Team Captain</h3>
                        <p className="mt-1 font-medium">{registrationData.captain_name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                        <p className="mt-1">{new Date(registrationData.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackRegistration;
