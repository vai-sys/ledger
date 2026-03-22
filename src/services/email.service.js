

require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// verify transporter once at startup
transporter.verify((err, success) => {
  if (err) {
    console.error("Transporter failed:", err);
  } else {
    console.log("Transporter ready");
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    console.log("Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("Message sent:", info.messageId);

  } catch (error) {
    console.error("EMAIL ERROR FULL:", {
      message: error.message,
      response: error.response,
      stack: error.stack
    });
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";

  const text = `Hello ${name},

Thank you for registering at Backend Ledger.
We're excited to have you on board!

Best regards,
The Backend Ledger Team`;

  const html = `<p>Hello ${name},</p>
<p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p>
<p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Successful!';

  const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} was successful.

Best regards,
The Backend Ledger Team`;

  const html = `<p>Hello ${name},</p>
<p>Your transaction of $${amount} to account ${toAccount} was successful.</p>
<p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Failed';

  const text = `Hello ${name},

We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed.

Best regards,
The Backend Ledger Team`;

  const html = `<p>Hello ${name},</p>
<p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed.</p>
<p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail
};