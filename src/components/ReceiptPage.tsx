
import React from 'react';
import { FormData } from '@/types/formTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Calendar, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptPageProps {
  data: FormData;
}

const ReceiptPage: React.FC<ReceiptPageProps> = ({ data }) => {
  const registrationDate = new Date();
  const receiptNumber = `MC-${Math.floor(10000 + Math.random() * 90000)}`;
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:py-0">
      <div className="flex flex-col items-center justify-center text-center mb-8 space-y-3">
        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Registration Successful</h2>
        <p className="text-gray-600">Your team registration for the Merchants Cup 2025 has been confirmed.</p>
      </div>

      <div className="print:hidden flex justify-center mb-6">
        <Button 
          onClick={handlePrint} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download size={18} />
          <span>Download Receipt</span>
        </Button>
      </div>

      <Card className="border-2 border-gray-200 overflow-hidden print:shadow-none">
        <div className="bg-blue-600 px-6 py-4 print:bg-white print:border-b print:border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center text-white print:text-gray-800">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img 
                src="/logo.jpeg" 
                alt="Merchant Cup Logo" 
                className="w-12 h-12 rounded-lg"
              />
              <div className="text-left">
                <h3 className="font-bold text-xl">Merchant Cup</h3>
                <p className="text-sm opacity-90 print:text-gray-600">RCGC Bowling Section</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold print:text-gray-800">RECEIPT</p>
              <p className="text-sm opacity-90 print:text-gray-600"># {receiptNumber}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium text-gray-900">{data.companyName}</p>
              <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">{data.address}</p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <p className="text-sm text-gray-500">Registration Date</p>
              <p className="font-medium text-gray-900 flex items-center gap-1 md:justify-end">
                <Calendar size={16} className="text-gray-400" /> 
                {format(registrationDate, 'dd MMMM yyyy')}
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Contact Information</p>
                <p className="font-medium text-gray-900 flex items-center gap-1 md:justify-end">
                  <Phone size={16} className="text-gray-400" /> 
                  {data.contactPhone}
                </p>
                <p className="font-medium text-gray-900 flex items-center gap-1 md:justify-end">
                  <Mail size={16} className="text-gray-400" /> 
                  {data.contactEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Registered Teams</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.teams.map((team, index) => (
                    <tr key={index}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Team {index + 1}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p className="font-medium text-gray-900">{team.player1.name}</p>
                          <p className="text-xs text-gray-500">{team.player1.mobile}</p>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium text-gray-900">{team.player2.name}</p>
                          <p className="text-xs text-gray-500">{team.player2.mobile}</p>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium text-gray-900">{team.player3.name}</p>
                          <p className="text-xs text-gray-500">{team.player3.mobile}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Captain</p>
                <p className="font-medium text-gray-900">{data.captainName}</p>
                <p className="text-sm text-gray-500">{data.designation}</p>
              </div>
              <div className="mt-4 md:mt-0 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Registration Fee</p>
                  <p className="text-lg font-bold text-gray-900">₹{data.totalAmount}</p>
                  <p className="text-xs text-green-600 font-medium">PAID</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="text-center text-sm text-gray-500">
              <p>Thank you for registering for the Merchant Cup Lawn Bowls Tournament 2025.</p>
              <p className="mt-2">For any queries, please contact RCGC Bowling Section.</p>
              <p className="mt-4 text-xs">Venue: RCGC Maidan Pavilion | Tournament Starts: May 9, 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptPage;
