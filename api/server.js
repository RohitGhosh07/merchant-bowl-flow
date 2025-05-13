const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Tournament Registration - ${formData.companyName}`,
      html: `
        <h2>New Team Registration</h2>
        <p><strong>Company:</strong> ${formData.companyName}</p>
        <p><strong>Contact:</strong> ${formData.contactPhone}</p>
        <p><strong>Email:</strong> ${formData.contactEmail}</p>
        <p><strong>Teams Registered:</strong> ${formData.numTeams}</p>
        <p><strong>Amount:</strong> ₹${formData.totalAmount}</p>
      `
    });

    // Email to registrant
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: formData.contactEmail,
      subject: 'Tournament Registration Confirmation',
      html: `
        <h2>Registration Confirmation</h2>
        <p>Thank you for registering for the tournament.</p>
        <p><strong>Registration Details:</strong></p>
        <p>Company: ${formData.companyName}</p>
        <p>Teams: ${formData.numTeams}</p>
        <p>Amount: ₹${formData.totalAmount}</p>
        <p>Payment Status: ${formData.paymentDetails.status}</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
