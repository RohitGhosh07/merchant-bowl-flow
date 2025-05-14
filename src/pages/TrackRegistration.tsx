import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Registration } from "@/types/registration";
import Navbar from "@/components/Navbar";
import { SearchIcon, CalendarIcon, UsersIcon, BuildingIcon, InfoIcon, BadgeCheckIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import logo paths and account for base path
const logoPath = import.meta.env.BASE_URL + 'logo.jpeg';
const rcgcLogoPath = import.meta.env.BASE_URL + 'rcgc.jpeg';

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
    try {
      const { data, error } = await supabase
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar showTrackingButton={false} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-6 mb-4">
              <img src={logoPath} alt="Merchant Cup Logo" className="w-16 h-16 rounded-lg shadow-sm" />
              <img src={rcgcLogoPath} alt="RCGC Logo" className="w-16 h-16 rounded-lg shadow-sm" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Track Your Registration</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enter your 6-digit tracking ID to view your registration details for the
              38th Merchants Cup 2025-26
            </p>
          </div>

          {/* Search Card */}
          <Card className="shadow-xl border-t-4 border-t-blue-600">
            <CardHeader className="text-center border-b bg-gray-50/50 pb-8">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <SearchIcon className="h-6 w-6 text-blue-600" />
                Registration Lookup
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Please enter your 6-digit tracking ID provided during registration
              </CardDescription>
              
              <form onSubmit={handleSearch} className="mt-6">
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit tracking ID"
                    value={trackingId}
                    onChange={handleTrackingIdChange}
                    maxLength={6}
                    className="flex-1 text-lg tracking-wider text-center font-mono h-12"
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    disabled={loading || trackingId.length !== 6}
                    className="w-full sm:w-auto px-8 h-12 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Searching..." : "Search Registration"}
                  </Button>
                </div>
              </form>
            </CardHeader>

            <CardContent className="pt-6">
              {registrationData && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="rounded-lg bg-white p-4 border-l-4 border-blue-600 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BadgeCheckIcon className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-medium text-gray-600">
                        Registration ID: <span className="font-mono text-blue-600">{registrationData.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Main Content Tabs */}
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Registration Details</TabsTrigger>
                      <TabsTrigger value="team">Team Information</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <div className="grid gap-6">
                        {/* Company Details */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <BuildingIcon className="h-5 w-5 text-gray-500" />
                              Company Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Company Name</p>
                                <p className="font-medium text-lg">{registrationData.company_name}</p>
                              </div>
                              {registrationData.gst_number && (
                                <div>
                                  <p className="text-sm text-gray-500">GST Number</p>
                                  <p className="font-medium">{registrationData.gst_number}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-sm text-gray-500">Contact Phone</p>
                                <p className="font-medium">{registrationData.contact_phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Contact Email</p>
                                <p className="font-medium">{registrationData.contact_email}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Registration Status */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <InfoIcon className="h-5 w-5 text-gray-500" />
                              Registration Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Registration Date</p>
                                <p className="font-medium">{formatDate(registrationData.created_at)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                  registrationData.payment_status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {registrationData.payment_status}
                                </div>
                              </div>
                              {registrationData.amount && (
                                <div>
                                  <p className="text-sm text-gray-500">Amount</p>
                                  <p className="font-medium">₹{registrationData.amount.toLocaleString('en-IN')}</p>
                                </div>
                              )}
                              {registrationData.payment_method && (
                                <div>
                                  <p className="text-sm text-gray-500">Payment Method</p>
                                  <p className="font-medium capitalize">{registrationData.payment_method}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="team">
                      <div className="grid gap-6">
                        {/* Team Information */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <UsersIcon className="h-5 w-5 text-gray-500" />
                              Team Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Team Number</p>
                                  <p className="font-medium">{registrationData.team_number}</p>
                                </div>
                              </div>

                              <div className="border rounded-lg overflow-hidden">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Player</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    <tr>
                                      <td className="px-4 py-3 text-sm">Player 1</td>
                                      <td className="px-4 py-3 text-sm font-medium">{registrationData.player1_name}</td>
                                      <td className="px-4 py-3 text-sm">{registrationData.player1_mobile || "-"}</td>
                                      <td className="px-4 py-3 text-sm">{registrationData.player1_email || "-"}</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm">Player 2</td>
                                      <td className="px-4 py-3 text-sm font-medium">{registrationData.player2_name}</td>
                                      <td className="px-4 py-3 text-sm">{registrationData.player2_mobile || "-"}</td>
                                      <td className="px-4 py-3 text-sm">{registrationData.player2_email || "-"}</td>
                                    </tr>
                                    {registrationData.player3_name && (
                                      <tr>
                                        <td className="px-4 py-3 text-sm">Player 3</td>
                                        <td className="px-4 py-3 text-sm font-medium">{registrationData.player3_name}</td>
                                        <td className="px-4 py-3 text-sm">{registrationData.player3_mobile || "-"}</td>
                                        <td className="px-4 py-3 text-sm">{registrationData.player3_email || "-"}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {/* Captain Information */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Team Captain</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{registrationData.captain_name}</p>
                                  </div>
                                  {registrationData.captain_designation && (
                                    <div>
                                      <p className="text-sm text-gray-500">Designation</p>
                                      <p className="font-medium">{registrationData.captain_designation}</p>
                                    </div>
                                  )}
                                  {registrationData.captain_phone && (
                                    <div>
                                      <p className="text-sm text-gray-500">Contact</p>
                                      <p className="font-medium">{registrationData.captain_phone}</p>
                                    </div>
                                  )}
                                  {registrationData.captain_email && (
                                    <div>
                                      <p className="text-sm text-gray-500">Email</p>
                                      <p className="font-medium">{registrationData.captain_email}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* No Results Message */}
              {!registrationData && !loading && trackingId.length === 6 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <SearchIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Registration Found</h3>
                  <p className="text-gray-500">
                    We couldn't find any registration with the tracking ID: {trackingId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tournament Info */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>RCGC Bowling Section | 38th Merchants Cup 2025-26</p>
            <p>Venue: RCGC Maidan Tent | Tournament Starts: June 15, 2025</p>
            <p>For any assistance, contact: +91 98765 43210 or email: support@rcgc.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRegistration;
