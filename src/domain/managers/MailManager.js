import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

class MailManager {
  async send(data) {
    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "correa92.dev@gmail.com",
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    let result = await transport.sendMail({
        from: data.from,
        to: data.to,
        subject: data.subject,
        html: `
        <div>
        <h1>¡Ésto es un test!</h1>
        </div>`,
        attachments: [],
    });
    return result
  }
}

export default MailManager;
