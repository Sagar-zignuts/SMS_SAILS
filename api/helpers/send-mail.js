// api/helpers/sendMail.js
const { nodemailer } = sails.config.constant;

require('dotenv').config();


module.exports = {
  friendlyName: 'Send Welcome Email',

  description: 'Send a welcome email to the user.',

  inputs: {
    to: {
      type: 'string',
      example: 'user@example.com',
      description:
        'The email address of the user to receive the welcome message.',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    const { to } = inputs;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    try {
      const mailOptions = {
        from: process.env.SENDER_MAIL, // Use environment variable for sender
        to,
        subject: 'Welcome to LMS!',
        text: `Hi, welcome to our Learning Management System! We're excited to have you on board.`,
        html: `<h1>Welcome!</h1><p>Hi, we're excited to have you on board with our Learning Management System.</p>`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${to}`);
      return exits.success(true);
    } catch (error) {
      console.error('Email sending error:', error);
      return exits.error(new Error('Failed to send welcome email'));
    }
  },
};
