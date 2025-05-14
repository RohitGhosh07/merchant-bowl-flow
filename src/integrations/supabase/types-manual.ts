
// This is a manual type definition to help TypeScript understand our database schema
// while we wait for an automatic type generation to be completed

export type RegistrationsTable = {
  id: string;
  created_at: string;
  company_name: string;
  team_number: string;
  player1_name: string;
  player2_name: string;
  player3_name?: string;
  player1_mobile?: string;
  player2_mobile?: string;
  player3_mobile?: string;
  player1_email?: string;
  player2_email?: string;
  player3_email?: string;
  captain_name: string;
  captain_phone?: string;
  captain_email?: string;
  payment_status: "Paid" | "Pending";
  payment_method?: "online" | "offline";
  payment_reference?: string;
  payment_date?: string;
  amount?: number;
  gst_number?: string;
  committee_member?: string;
  registration_status?: "active" | "cancelled";
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
  captain_designation?: string;
  timestamp?: string;
};

export type Database = {
  public: {
    Tables: {
      registrations: {
        Row: RegistrationsTable;
        Insert: Partial<RegistrationsTable> & {
          company_name: string;
          team_number: string;
          player1_name: string;
          player2_name: string;
          captain_name: string;
          id: string;
        };
        Update: Partial<RegistrationsTable>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
