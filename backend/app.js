require("dotenv").config();

const nodeMailer = require("nodemailer");
const html = `
<h1>Hi just to see that is adithya sharma has slept or not??</h1>
`;

async function main() {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "companyas2025@gmail.com",
      subject: "Testing the concept",
      html: html,
    });

    console.log(`Message Sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw to be caught by the main catch block
  }
}

main().catch((error) => console.error("Application error:", error));
