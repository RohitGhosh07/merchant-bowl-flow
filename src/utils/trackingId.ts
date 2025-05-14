import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a random 6-digit tracking ID and ensures it's unique
 * @returns Promise<string> A unique 6-digit tracking ID
 */
export const generateTrackingId = async (): Promise<string> => {
  let isUnique = false;
  let id = "";

  while (!isUnique) {
    // Generate a random 6-digit number
    id = Math.floor(100000 + Math.random() * 900000).toString();
      // Check if this ID already exists in the database
    const { data, error } = await supabase
      .from("registrations")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    
    if (!data && !error) {
      isUnique = true;
    }
  }

  return id;
};
