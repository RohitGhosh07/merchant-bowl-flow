
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormData } from "@/types/formTypes";
import { useToast } from "@/hooks/use-toast";

interface ReceiptPageProps {
  formData: FormData;
}

const ReceiptPage = ({ formData }: ReceiptPageProps) => {
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          ${printContent}
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContent;
      
      // Show success toast after printing
      setTimeout(() => {
        toast({
          title: "Print Initiated",
          description: "Your receipt has been sent to the printer.",
        });
      }, 500);
    }
  };

  const handleDownload = () => {
    // This is a simple implementation. In a real app, you'd generate a proper PDF
    const receiptText = `
RCGC Lawn Bowls Tournament 2024-25 - RECEIPT

Company: ${formData.companyName}
Teams Registered: ${formData.numTeams}
Amount Paid: ₹${formData.totalAmount}
Captain: ${formData.captainName}
Date: ${formData.date}

Venue: RCGC Maidan Pavilion
Practice Begins: April 22, 2024
Tournament Starts: May 9, 2024
Gala Dinner & Prize Distribution: June 9, 2024

Thank you for your registration!
    `;
    
    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `RCGC_Receipt_${formData.companyName.replace(/\s+/g, "_")}.txt`;
    link.href = url;
    link.click();
    
    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded as a text file.",
    });
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-bowlsGreen">
          Registration Complete!
        </h2>
        <p className="text-gray-600">
          Your registration and payment have been successfully processed.
        </p>
      </div>

      <div ref={receiptRef}>
        <Card className="bg-white shadow-xl border border-bowlsGold p-6 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-bowlsNavy">PAYMENT RECEIPT</h3>
            <p className="text-bowlsGreen text-lg font-medium">
              37th RCGC Merchants Cup Lawn Bowls Tournament 2024-25
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-600">Receipt Number</p>
              <p className="font-medium">{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border-t border-b py-6 my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium">{formData.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Captain</p>
                <p className="font-medium">{formData.captainName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Teams Registered</p>
                <p className="font-medium">{formData.numTeams}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="font-medium">{formatDate(formData.date)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <table className="w-full text-left">
              <thead className="text-sm text-gray-600 border-b">
                <tr>
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3">Registration Fee ({formData.numTeams} Team{formData.numTeams > 1 ? 's' : ''})</td>
                  <td className="py-3 text-right">₹{formData.numTeams * 8850}</td>
                </tr>
                <tr className="border-t">
                  <td className="py-3 font-medium">Total</td>
                  <td className="py-3 text-right font-bold">₹{formData.totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8 p-4 bg-green-50 rounded-md">
            <h4 className="font-medium text-bowlsGreen mb-2">Tournament Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Venue</p>
                <p className="font-medium">RCGC Maidan Pavilion</p>
              </div>
              <div>
                <p className="text-gray-600">Practice Begins</p>
                <p className="font-medium">April 22, 2024</p>
              </div>
              <div>
                <p className="text-gray-600">Tournament Starts</p>
                <p className="font-medium">May 9, 2024</p>
              </div>
              <div>
                <p className="text-gray-600">Prize Distribution</p>
                <p className="font-medium">June 9, 2024</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-bowlsNavy font-medium">Thank you for your registration!</p>
            <p className="text-gray-600 italic mt-1">See you on the greens!</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button 
          onClick={handlePrint}
          className="bg-bowlsGreen hover:bg-bowlsGreen-dark"
        >
          Print Receipt
        </Button>
        <Button 
          onClick={handleDownload}
          variant="outline" 
          className="border-bowlsGreen text-bowlsGreen hover:bg-green-50"
        >
          Download Receipt
        </Button>
      </div>
    </div>
  );
};

export default ReceiptPage;
