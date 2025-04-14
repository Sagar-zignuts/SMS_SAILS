const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

function sendWelcomeMessage(email) {
  const mailOptions = {
    from: process.env.SENDER_MAIL, // Sender address
    to: email, // Receiver address
    subject: 'Welcome to LMS!',
    text: `Hi , welcome to our Learning Management System! We're excited to have you on board.`,
    html: `<h1>Welcome!</h1><p>We're excited to have you on board with our Learning Management System.</p>`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
    console.log('Email sent:', info.response);
    return true;
  });
}

module.exports = { sendWelcomeMessage };
