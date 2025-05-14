import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'noreply@rcgcbooking.in',
    pass: '448C6E8A8A5EB937B818F0246D86F6754497'
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Email to admin
    await transporter.sendMail({
      from: 'RCGC <noreply@rcgcbooking.in>',
      to: 'rcgcbowls@gmail.com',
      subject: `New Tournament Registration - ${formData.companyName}`,
      html: `
        <h2>New Team Registration - 38th Merchants Cup 2025-26</h2>
        <p><strong>Company:</strong> ${formData.companyName}</p>
        <p><strong>GST Number:</strong> ${formData.gstNumber}</p>
        <p><strong>Contact:</strong> ${formData.contactPhone}</p>
        <p><strong>Email:</strong> ${formData.contactEmail}</p>
        <p><strong>Teams Registered:</strong> ${formData.numTeams}</p>
        <p><strong>Amount:</strong> ₹${formData.totalAmount}</p>
      `
    });

    // Email to registrant
    await transporter.sendMail({
      from: 'RCGC <noreply@rcgcbooking.in>',
      to: formData.contactEmail,
      subject: '38th Merchants Cup 2025-26 - Registration Confirmation',
      html: `
        <h2>38th Merchants Cup 2025-26 - Registration Confirmation</h2>
        <p>Thank you for registering for the tournament.</p>
        <p><strong>Registration Details:</strong></p>
        <p>Company: ${formData.companyName}</p>
        <p>GST Number: ${formData.gstNumber}</p>
        <p>Teams: ${formData.numTeams}</p>
        <p>Amount: ₹${formData.totalAmount}</p>
        <p>Payment Status: ${formData.paymentDetails.status}</p>
        <br>
        <p><strong>Tournament Details:</strong></p>
        <p>Venue: RCGC Maidan Tent</p>
        <p>Tournament Starts: June 15, 2025</p>
        <br>
        <p>For any queries, please contact the tournament committee.</p>
        <p>Best regards,<br>RCGC Bowling Section</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
