import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ReCAPTCHA from "react-google-recaptcha";

export interface BookingFormProps {
  amount: number;
}

export function BookingForm({ amount }: BookingFormProps) {
  const [step, setStep] = useState<'name' | 'contact' | 'verify'>('name');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    paymentMethod: 'online' as 'online' | 'offline'
  });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 'name' && formData.fullName) {
      setStep('contact');
    } else if (step === 'contact' && formData.phoneNumber && formData.email) {
      setStep('verify');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      alert('Please verify the CAPTCHA first');
      return;
    }

    if (formData.paymentMethod === 'online') {
      const encodedName = encodeURIComponent(formData.fullName);
      const paymentUrl = `https://rcgcbooking.in/ccavenue_pg_v2/make_payment_merchant.php?organization_id=RCGC&name=${encodedName}&phone_number=${formData.phoneNumber}&amount=${amount}`;
      window.location.href = paymentUrl;
    } else {
      alert('Please visit the club office for offline payment');
    }
  };

  const handleCaptchaVerify = (value: string | null) => {
    setIsCaptchaVerified(!!value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 'name' && (
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter your full name"
          />
          <Button 
            type="button" 
            onClick={handleNext}
            className="w-full mt-4"
            disabled={!formData.fullName}
          >
            Next
          </Button>
        </div>
      )}

      {step === 'contact' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              pattern="[0-9]{10}"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="Enter your email address"
            />
          </div>

          <Button 
            type="button" 
            onClick={handleNext}
            className="w-full"
            disabled={!formData.phoneNumber || !formData.email}
          >
            Next
          </Button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={handleCaptchaVerify}
            />
          </div>

          <div className="space-y-4">
            <Label>Payment Method *</Label>
            <RadioGroup
              defaultValue="online"
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as 'online' | 'offline' }))}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline">Offline Payment</Label>
              </div>
            </RadioGroup>

            <div className="pt-4">
              <p className="text-lg font-medium text-center mb-4">
                Amount: ₹{amount.toLocaleString('en-IN')}
              </p>
              <Button
                type="submit"
                className="w-full"
                disabled={!isCaptchaVerified}
              >
                {formData.paymentMethod === 'online' ? 'Proceed to Payment' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}