
/**
 * Utility for Google Sheets API interactions
 */

export interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  sheetName?: string;
}

export const appendToSheet = async (
  config: GoogleSheetsConfig,
  values: any[][]
): Promise<boolean> => {
  try {
    if (!config.apiKey || !config.spreadsheetId) {
      console.error("Google Sheets configuration is incomplete");
      return false;
    }

    const sheetName = config.sheetName || "Sheet1";
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&key=${config.apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API error:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error appending to Google Sheet:", error);
    return false;
  }
};

export const formatTeamData = (formData: any): any[][] => {
  const rows: any[][] = [];
  
  // Add header row if sheet is empty
  rows.push([
    "Timestamp",
    "Company Name",
    "Address",
    "Team Number",
    "Player 1 Name",
    "Player 1 Mobile",
    "Player 2 Name",
    "Player 2 Mobile",
    "Reserve Name",
    "Reserve Mobile",
    "Captain Name",
    "Designation",
    "Registration Date",
    "Payment Amount",
    "Payment Status"
  ]);

  // Add data rows for each team
  formData.teams.forEach((team: any, index: number) => {
    rows.push([
      new Date().toISOString(),
      formData.companyName,
      formData.address,
      `Team ${index + 1}`,
      team.player1.name,
      team.player1.mobile,
      team.player2.name,
      team.player2.mobile,
      team.reserve?.name || "N/A",
      team.reserve?.mobile || "N/A",
      formData.captainName,
      formData.designation,
      formData.date,
      (formData.totalAmount / formData.numTeams).toFixed(2),
      "Paid"
    ]);
  });
  
  return rows;
};
