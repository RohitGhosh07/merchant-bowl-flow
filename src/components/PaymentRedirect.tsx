import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

interface PaymentRedirectProps {
  amount: number;
  phone: string;
  name: string;
  email: string;
  companyName: string;
}

export const PaymentRedirect = ({ amount, phone, name, email, companyName }: PaymentRedirectProps) => {
  useEffect(() => {
    // Immediate redirection to payment gateway
    const encodedName = encodeURIComponent(name);
    const encodedCompanyName = encodeURIComponent(companyName);
    const paymentUrl = `https://rcgcbooking.in/ccavenue_pg_v2/make_payment_merchant.php?organization_id=RCGC&name=${encodedCompanyName}&phone_number=${phone}&amount=10&email=${email}&company_name=${encodedCompanyName}`;
    window.location.href = paymentUrl;
  }, [amount, phone, name, email, companyName]);

  return null; // No UI needed since we're redirecting immediately
};
