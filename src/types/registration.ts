
export interface Registration {
  id: string;
  created_at: string;
  company_name: string;
  team_number: string;
  player1_name: string;
  player2_name: string;
  captain_name: string;
  payment_status: "Paid" | "Pending";
  timestamp?: string;
}
