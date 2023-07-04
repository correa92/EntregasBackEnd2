import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { resolve } from "path";
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

    const resolvePath = resolve("./src/presentation/public");

    let result = await transport.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: `
        <div>
        <h1>¡Ésto es un test!</h1>
        <img src="cid:coder.png"
        </div>`,
      attachments: [
        {
          filename: "coder.png",
          path: resolvePath + "/images/coder.png",
          cid: "coder.png",
        },
      ],
    });
    return result;
  }
}

export default MailManager;
