import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/formTypes';
import { PrinterIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import logo image and account for base path
const logoPath = import.meta.env.BASE_URL + 'logo.jpeg';

interface ReceiptPageProps {
  data: FormData;
}

const ReceiptPage = ({ data }: ReceiptPageProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const handlePrint = () => {
    const printContents = receiptRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;
    
    if (printContents) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Registration Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #1e40af; }
              .header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
              .logo { width: 80px; height: 80px; }
              .receipt-section { margin-bottom: 20px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              table, th, td { border: 1px solid #e2e8f0; }
              th, td { padding: 8px 12px; text-align: left; }
              th { background-color: #f1f5f9; }
              .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #64748b; }
              .payment-status { padding: 4px 8px; border-radius: 4px; display: inline-block; }
              .completed { background-color: #dcfce7; color: #166534; }
              .pending { background-color: #fef3c7; color: #92400e; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContents}
            <div class="footer">
              <p>RCGC Bowling Section | 38th Merchants Cup 2025-26</p>
              <p>For any queries, please contact the tournament committee.</p>
            </div>
          </body>
        </html>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Determine payment status display
  const getPaymentStatusDisplay = () => {
    const status = data.paymentDetails.status;
    if (status === 'completed') {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span>;
    } else {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Registration Receipt</h2>
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <PrinterIcon size={16} />
            Print Receipt
          </Button>
          <Button onClick={() => navigate('/')} variant="outline">
            New Registration
          </Button>
        </div>
      </div>

      <div 
        ref={receiptRef}
        className="bg-white p-6 border border-gray-200 rounded-lg"
      >
        <div className="header flex items-center gap-4 mb-6">
          <img src={logoPath} alt="Merchant Cup Logo" className="w-16 h-16 rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">38th Merchants Cup 2025-26</h1>
            <p className="text-gray-600">RCGC Bowling Section</p>
          </div>
        </div>

        <div className="receipt-section">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Registration Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <div>
              <p className="text-sm text-gray-500">Registration Date</p>
              <p className="font-medium">{formatDate(data.paymentDetails.paymentDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p>{getPaymentStatusDisplay()}</p>
              
              {data.paymentDetails.status === 'pending' && data.paymentDetails.committeeMember && (
                <p className="text-sm text-gray-600 mt-1">
                  Please pay to: {data.paymentDetails.committeeMember.name}
                </p>
              )}
              
              {data.paymentDetails.referredBy && (
                <p className="text-sm text-gray-600 mt-1">
                  Referred by: {data.paymentDetails.referredBy}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="receipt-section">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="font-medium">{data.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Information</p>
              <p className="font-medium">{data.contactPhone}</p>
              <p className="text-sm text-gray-600">{data.contactEmail}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{data.address}</p>
            </div>
          </div>
        </div>

        <div className="receipt-section">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Details</h3>
          {data.teams.map((team, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-100 rounded-md bg-gray-50">
              <h4 className="font-medium mb-2">Team {index + 1}</h4>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Role</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-t">Player 1</td>
                    <td className="py-2 px-4 border-t">{team.player1.name}</td>
                    <td className="py-2 px-4 border-t">{team.player1.mobile}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-t">Player 2</td>
                    <td className="py-2 px-4 border-t">{team.player2.name}</td>
                    <td className="py-2 px-4 border-t">{team.player2.mobile}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-t">Player 3</td>
                    <td className="py-2 px-4 border-t">{team.player3.name}</td>
                    <td className="py-2 px-4 border-t">{team.player3.mobile}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="receipt-section">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Captain Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Captain Name</p>
              <p className="font-medium">{data.captainName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Designation</p>
              <p className="font-medium">{data.designation}</p>
            </div>
          </div>
        </div>

        <div className="receipt-section">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Teams Registered</p>
              <p className="font-medium">{data.numTeams}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium text-blue-600">₹{data.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-center text-sm text-gray-600">
          <p>For any queries, please contact the tournament committee.</p>
          <p className="mt-1">Thank you for participating in the 38th Merchants Cup 2025-26!</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
