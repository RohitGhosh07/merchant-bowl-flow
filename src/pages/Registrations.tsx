
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface RegistrationData {
  timestamp: string;
  companyName: string;
  teamNumber: string;
  player1Name: string;
  player2Name: string;
  captainName: string;
  paymentStatus: string;
}

interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  sheetName: string;
}

const Registrations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [config, setConfig] = useState<GoogleSheetsConfig>({
    apiKey: "",
    spreadsheetId: "",
    sheetName: "Sheet1",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const fetchRegistrations = async () => {
    if (!config.apiKey || !config.spreadsheetId) {
      toast({
        title: "Missing Configuration",
        description: "Please enter your Google Sheets API key and spreadsheet ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.sheetName}?key=${config.apiKey}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length > 1) {
        const headers = data.values[0];
        const rows = data.values.slice(1);
        
        const processedData: RegistrationData[] = rows.map((row: any) => {
          const rowData: Record<string, string> = {};
          headers.forEach((header: string, index: number) => {
            const key = header.toLowerCase().replace(/\s+/g, '');
            rowData[key] = row[index] || "";
          });
          
          return {
            timestamp: rowData.timestamp || "",
            companyName: rowData.companyname || "",
            teamNumber: rowData.teamnumber || "",
            player1Name: rowData.player1name || "",
            player2Name: rowData.player2name || "",
            captainName: rowData.captainname || "",
            paymentStatus: rowData.paymentstatus || "",
          };
        });
        
        setRegistrations(processedData);
        
        toast({
          title: "Registrations Loaded",
          description: `Successfully loaded ${processedData.length} registrations.`,
        });
      } else {
        toast({
          title: "No Data Found",
          description: "No registration data found in the spreadsheet.",
          variant: "destructive",
        });
      }
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
      <h1 className="text-2xl font-serif font-bold text-bowlsNavy mb-8">
        Registration Records
      </h1>
      
      <Card className="mb-6">
        <CardHeader className="bg-bowlsGreen text-white">
          <CardTitle>Google Sheets Configuration</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <Input
                id="apiKey"
                name="apiKey"
                value={config.apiKey}
                onChange={handleInputChange}
                placeholder="AIzaSyB..."
              />
            </div>
            <div>
              <label htmlFor="spreadsheetId" className="block text-sm font-medium text-gray-700 mb-1">
                Spreadsheet ID
              </label>
              <Input
                id="spreadsheetId"
                name="spreadsheetId"
                value={config.spreadsheetId}
                onChange={handleInputChange}
                placeholder="1BxiMVs0XRA5nF..."
              />
            </div>
            <div>
              <label htmlFor="sheetName" className="block text-sm font-medium text-gray-700 mb-1">
                Sheet Name
              </label>
              <Input
                id="sheetName"
                name="sheetName"
                value={config.sheetName}
                onChange={handleInputChange}
                placeholder="Sheet1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button 
              onClick={fetchRegistrations}
              disabled={loading}
              className="bg-bowlsGreen hover:bg-bowlsGreen-dark"
            >
              {loading ? "Loading..." : "Load Registrations"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {registrations.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-4">Registration Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player 1</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player 2</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Captain</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((reg, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.teamNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.player1Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.player2Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.captainName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reg.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reg.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registrations;
