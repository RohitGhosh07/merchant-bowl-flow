
export interface TeamMember {
  name: string;
  mobile: string;
}

export interface Team {
  player1: TeamMember;
  player2: TeamMember;
  reserve?: TeamMember;
}

export interface FormData {
  companyName: string;
  address: string;
  teams: Team[];
  captainName: string;
  designation: string;
  date: string;
  signature?: string;
  rulesAccepted: boolean;
  numTeams: number;
  totalAmount: number;
}
