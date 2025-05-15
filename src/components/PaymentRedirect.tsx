import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

interface PaymentRedirectProps {
  amount: number;
  phone: string;
  name: string;
  email: string;
}

export const PaymentRedirect = ({ amount, phone, name,email }: PaymentRedirectProps) => {
  useEffect(() => {
    // Immediate redirection to payment gateway
    const encodedName = encodeURIComponent(name);
    const paymentUrl = `https://rcgcbooking.in/ccavenue_pg_v2/make_payment_merchant.php?organization_id=RCGC&name=${encodedName}&phone_number=${phone}&amount=${amount}&email=${email}`;
    window.location.href = paymentUrl;
  }, [amount, phone, email]);

  return null; // No UI needed since we're redirecting immediately
};
