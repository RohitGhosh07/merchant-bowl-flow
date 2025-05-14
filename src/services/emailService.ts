import { FormData } from '@/types/formTypes';

const ELASTIC_EMAIL_API_KEY = '448C6E8A8A5EB937B818F0246D86F6754497';
const EMAIL_FROM = 'RCGC <noreply@rcgcbooking.in>';

const generateEmailHTML = (formData: FormData): string => {
  const teamDetails = formData.teams.map((team, index) => `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
      <h3 style="color: #2563eb; margin-bottom: 10px;">Team ${index + 1}</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li>Player 1: ${team.player1.name} (${team.player1.mobile})</li>
        <li>Player 2: ${team.player2.name} (${team.player2.mobile})</li>
        <li>Player 3: ${team.player3.name} (${team.player3.mobile})</li>
      </ul>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #1e3a8a; }
        .content { margin-bottom: 30px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .highlight { color: #2563eb; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RCGC 38th Merchants Cup Lawn Bowls Tournament 2025-26</h1>
          <p>Registration Confirmation</p>
        </div>

        <div class="content">
          <p>Dear ${formData.captainName},</p>
          
          <p>Thank you for registering for the 38th RCGC Merchants Cup Lawn Bowls Tournament 2025-26. Your registration has been successfully processed.</p>
          
          <h2>Registration Details:</h2>          <ul>
            <li>Company: <span class="highlight">${formData.companyName}</span></li>
            <li>GST Number: <span class="highlight">${formData.gstNumber}</span></li>
            <li>Number of Teams: <span class="highlight">${formData.numTeams}</span></li>
            <li>Total Amount: <span class="highlight">₹${formData.totalAmount}</span></li>
            <li>Payment Method: <span class="highlight">${formData.paymentDetails.method.toUpperCase()}</span></li>
            ${formData.paymentDetails.method === 'offline' && formData.paymentDetails.committeeMember 
              ? `<li>Committee Member: <span class="highlight">${formData.paymentDetails.committeeMember.name}</span></li>` 
              : ''}
          </ul>

          <h2>Team Details:</h2>
          ${teamDetails}

          <h2>Important Dates:</h2>
          <ul>
            <li>Practice Sessions Begin: April 22, 2024</li>
            <li>Tournament Starts: May 9, 2024</li>
            <li>Gala Dinner & Prize Distribution: June 9, 2024</li>
          </ul>

          <p><strong>Venue:</strong> RCGC Maidan Pavilion</p>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #2563eb;">Important Notes:</h3>
            <ol>
              <li>All players must adhere to the RCGC dress code on the greens.</li>
              <li>Teams must report 15 minutes before their scheduled match time.</li>
              <li>The tournament schedule will be shared closer to the start date.</li>
            </ol>
          </div>
        </div>

        <div class="footer">
          <p>For any queries, please contact the tournament committee.</p>
          <p>Best regards,<br>RCGC Tournament Committee</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendRegistrationEmail = async (formData: FormData): Promise<boolean> => {
  try {
    const allEmails = new Set<string>([formData.contactEmail]);
    formData.teams.forEach(team => {
      if (team.player1.email) allEmails.add(team.player1.email);
      if (team.player2.email) allEmails.add(team.player2.email);
      if (team.player3.email) allEmails.add(team.player3.email);
    });

    // Send email to admin
    const adminEmailResponse = await fetch('https://api.elasticemail.com/v4/emails/transactional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ElasticEmail-ApiKey': ELASTIC_EMAIL_API_KEY,
      },
      body: JSON.stringify({
        Recipients: [{ 
          Email: 'rcgcbowls@gmail.com'
        }],
        Content: {
          Body: [{
            ContentType: 'HTML',
            Content: `
              <h2>New Team Registration - 38th Merchants Cup 2025-26</h2>
              <p><strong>Company:</strong> ${formData.companyName}</p>
              <p><strong>GST Number:</strong> ${formData.gstNumber}</p>
              <p><strong>Contact:</strong> ${formData.contactPhone}</p>
              <p><strong>Email:</strong> ${formData.contactEmail}</p>
              <p><strong>Teams Registered:</strong> ${formData.numTeams}</p>
              <p><strong>Amount:</strong> ₹${formData.totalAmount}</p>
            `
          }],
          From: EMAIL_FROM,
          Subject: `New Tournament Registration - ${formData.companyName}`
        }
      })
    });

    if (!adminEmailResponse.ok) {
      throw new Error('Failed to send admin notification email');
    }

    // Send confirmation email to registrant and team members
    const registrantEmailResponse = await fetch('https://api.elasticemail.com/v4/emails/transactional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ElasticEmail-ApiKey': ELASTIC_EMAIL_API_KEY,
      },
      body: JSON.stringify({
        Recipients: Array.from(allEmails).map(email => ({ Email: email })),
        Content: {
          Body: [{
            ContentType: 'HTML',
            Content: generateEmailHTML(formData)
          }],
          From: EMAIL_FROM,
          Subject: `RCGC Merchants Cup - Registration Confirmation - ${formData.companyName}`
        }
      })
    });

    if (!registrantEmailResponse.ok) {
      throw new Error('Failed to send confirmation email');
    }

    console.log('Registration emails sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending registration emails:', error);
    throw error;
  }
};