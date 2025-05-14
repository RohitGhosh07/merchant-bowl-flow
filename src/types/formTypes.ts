export interface TeamMember {
  name: string;
  mobile: string;
  email?: string;
  role?: 'captain' | 'player';
}

export interface Team {
  player1: TeamMember;
  player2: TeamMember;
  player3: TeamMember;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  phone: string;
}

export interface PaymentDetails {
  method: 'online' | 'offline';
  status: 'pending' | 'completed';
  amount: number;
  transactionId?: string;
  committeeMember?: CommitteeMember;
  referredBy?: string;
  paymentDate: string;
}

export interface FormData {
  companyName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  gstNumber: string; // Add GST number field
  teams: Team[];
  captainName: string;
  designation: string;  rulesAccepted: boolean;
  numTeams: number;
  totalAmount: number;
  paymentDetails: PaymentDetails;
}

export interface GoogleSheetsIntegration {
  enabled: boolean;
  apiKey: string;
  spreadsheetId: string;
  sheetName: string;
}
