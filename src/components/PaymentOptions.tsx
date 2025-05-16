import React, { useState } from 'react';
import { PaymentRedirect } from './PaymentRedirect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import ReCaptcha from "@/components/ReCaptcha";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PaymentDetails, CommitteeMember } from '@/types/formTypes';
import { toast } from 'sonner';

// Dummy committee members data
const committeeMembers: CommitteeMember[] = [
  { id: '1', name: 'Sanjay Lakhotia', designation: 'Committee Member', phone: '' },
  { id: '2', name: 'Vikram Poddar', designation: 'Committee Member', phone: '' },
  { id: '3', name: 'Rajesh Kankaria', designation: 'Committee Member', phone: '' },
  { id: '4', name: 'Prashant Mehra', designation: 'Committee Member', phone: '' },
  { id: '5', name: 'Timir Roy', designation: 'Committee Member', phone: '' },
  { id: '6', name: 'Chandan Shroff', designation: 'Committee Member', phone: '' },
  { id: '7', name: 'Somenath Chatterjee', designation: 'Committee Member', phone: '' },
  { id: '8', name: 'Devesh Srivastava', designation: 'Committee Member', phone: '' },
  { id: '9', name: 'Samit Malhotra', designation: 'Committee Member', phone: '' },
  { id: '10', name: 'Agnesh Kumar Verma', designation: 'Committee Member', phone: '' },
  { id: '11', name: 'Rajesh Kapoor', designation: 'Committee Member', phone: '' },
];

interface PaymentOptionsProps {
  onPaymentUpdate: (details: PaymentDetails) => void;
  amount: number;
  phoneNumber?: string;
  name?: string;
  email?: string;
  companyName?: string;
  rulesAccepted: boolean;
  onRulesAcceptedChange: (checked: boolean) => void;
  onCaptchaVerify: () => void;
}

export function PaymentOptions({ 
  onPaymentUpdate, 
  amount, 
  phoneNumber,
  name,
  email,
  companyName,
  rulesAccepted,
  onRulesAcceptedChange,
  onCaptchaVerify
}: PaymentOptionsProps) {
  const [showPaymentRedirect, setShowPaymentRedirect] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [selectedMember, setSelectedMember] = useState<string>('');

  // Handle payment redirection
  if (showPaymentRedirect && paymentMethod === 'online' && phoneNumber && rulesAccepted) {
    return <PaymentRedirect 
      amount={amount} 
      phone={phoneNumber} 
      name={name || "Guest"} 
      email={email || ""} 
      companyName={companyName || ""} 
    />;
  }

  const handlePaymentMethodChange = (value: string) => {
    const method = value as 'online' | 'offline';
    setPaymentMethod(method);

    const details: PaymentDetails = {
      method: method,
      status: 'pending',
      amount,
      paymentDate: new Date().toISOString(),
      ...(method === 'offline' && selectedMember && {
        committeeMember: committeeMembers.find(m => m.id === selectedMember)
      })
    };

    if (method === 'online') {
      // Only redirect if phone number is available
      if (phoneNumber) {
        setShowPaymentRedirect(true);
      } else {
        toast(
          <div>
            <div className="font-bold text-red-600">Missing Phone Number</div>
            <div>Please provide a contact phone number for payment processing.</div>
          </div>
        );
      }
    }

    onPaymentUpdate(details);
  };

  const handleCommitteeMemberChange = (value: string) => {
    setSelectedMember(value);
    if (paymentMethod === 'offline') {
      const details: PaymentDetails = {
        method: 'offline',
        status: 'pending',
        amount,
        paymentDate: new Date().toISOString(),
        committeeMember: committeeMembers.find(m => m.id === value)
      };
      onPaymentUpdate(details);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Payment Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Select Payment Method</Label>
          <RadioGroup
            defaultValue="online"
            onValueChange={handlePaymentMethodChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label
                htmlFor="online"
                className="flex flex-col cursor-pointer p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >                <span className="font-medium">Online Payment</span>
                <span className="text-sm text-gray-500">Pay securely via CCAvenue</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="offline" />
              <Label
                htmlFor="offline"
                className="flex flex-col cursor-pointer p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Offline Payment</span>
                <span className="text-sm text-gray-500">Pay</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'online' && (
          <div className="space-y-4 animate-in fade-in-50">            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Online Payment via CCAvenue</h3>
              <p className="text-sm text-blue-600 mb-2">Amount: ₹{amount.toLocaleString()}</p>
              <div className="mt-4 text-sm text-blue-700">
                <p>✓ Secure payment gateway</p>
                <p>✓ Multiple payment options</p>
                <p>✓ Instant confirmation</p>
              </div>
              <p className="mt-4 text-xs text-blue-600">Click "Next" to proceed to the secure payment gateway</p>
            </div>
          </div>
        )}

        {paymentMethod === 'offline' && (
          <div className="space-y-4 animate-in fade-in-50">
            <div className="space-y-2">
              <Label>Select Committee Member</Label>
              <Select value={selectedMember} onValueChange={handleCommitteeMemberChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a committee member" />
                </SelectTrigger>
                <SelectContent>
                  {committeeMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex flex-col">
                        <span>{member.name}</span>
                        <span className="text-sm text-gray-500">{member.designation}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMember && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800 mb-2">Selected Member Details</h3>
                {(() => {
                  const member = committeeMembers.find(m => m.id === selectedMember);
                  return member ? (
                    <>
                      <p className="text-sm text-green-600">Name: {member.name}</p>
                      <p className="text-sm text-green-600">Role: {member.designation}</p>
                      <p className="text-sm text-green-600">Contact: {member.phone}</p>
                    </>
                  ) : null;
                })()}              </div>
            )}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-medium mb-3 text-gray-700">Team Rules and Regulations</h3>
            <div className="text-sm text-gray-600 h-40 overflow-y-auto p-3 border border-slate-200 rounded-md bg-white mb-4">
              <p className="font-semibold mb-2">TEAM</p>
              <p>• A team consists of two players called LEAD and SKIP, in which the Lead bowls first followed by Skip.</p>
              <p>• Teams with total handicap of 19 or 20 must have at least one playing member from the participating company.</p>
              <p>• Teams with total handicap of 18 or less must have both playing members from the participating company.</p>
              <p>• Each player rolls four woods each.</p>
              <p>• Before the start of the game, two practice ends with two woods each player shall be allowed.</p>
              
              <p className="font-semibold mt-4 mb-2">TEAM HANDICAP</p>
              <p>• The team Handicap shall be ascertained by taking into account the handicap of the two best players of the team.</p>
              <p>• This handicap shall remain unchanged for the entire tournament.</p>
              <p>• The committee reserves the right to alter the handicap of a team at any given time during the tournament.</p>
              
              <p className="font-semibold mt-4 mb-2">WALKOVER</p>
              <p>• If a team is not present 30 minutes after the scheduled match timing then the opponent will get a walkover.</p>
              <p>• In case both the teams are not present, then the opponent of the next round gets a bye.</p>
            </div>

            <h3 className="font-medium mb-3 text-gray-700 mt-6">Code of Etiquette</h3>
            <div className="text-sm text-gray-600 h-40 overflow-y-auto p-3 border border-slate-200 rounded-md bg-white mb-4">
              <p>BOWLS is perhaps one of the most sociable games that one can play - its very pace allows for friendship to be quickly established which are often enduring. The game has its own charm and attracts people from all walks of life.</p>
              
              <p className="mt-4">The code of etiquette observed by bowlers ensure that in no circumstances does one bowler have an obvious or unfair advantage over another. On the green all players are regarded equal.</p>
              
              <p className="mt-4 mb-2">Key Points to Observe:</p>
              <p>• Always be on time for matches and dress correctly.</p>
              <p>• Stand still and remain quiet when the players are about to deliver.</p>
              <p>• Remain behind the mat or the head when it isn't your turn to play.</p>
              <p>• Keep to your own rink, being aware of shadows on a sunny day or under lights.</p>
              <p>• Avoid obscuring any of the rink markers or boundary pegs.</p>
              <p>• Pay attention to what is going on during the game and particularly to your skip's instructions.</p>
              <p>• Smoking, Drinking and consumption of food or gutka is not allowed on the Playing Greens.</p>
              <p>• Prompting or advicing is NOT ALLOWED from outside the Greens other than their own team members.</p>
              <p>• Only players and officials are allowed to enter the green and the demarcated area.</p>
              <p>• Never openly criticize and always appear to be enjoying the game - despite your misfortunes.</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rules"
                checked={rulesAccepted}
                defaultChecked={true}
                onCheckedChange={onRulesAcceptedChange}
              />
              <label
                htmlFor="rules"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the tournament rules and conditions*
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <ReCaptcha onVerify={onCaptchaVerify} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
