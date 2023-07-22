import dotenv from "dotenv";
import Handlebars from "handlebars";
dotenv.config();
import nodemailer from "nodemailer";
import { resolve } from "path";
import fs from "fs";
import UserManager from "./userManager.js";
import { generateToken } from "../../shared/shared.js";
class MailManager {
  constructor() {
    this.smtp_config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      secure: process.env.SMTP_SECURE_SSL,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };
  }
  async send(data, templateFile) {
    const transport = nodemailer.createTransport(this.smtp_config);

    const templatePath = resolve(
      `src/presentation/views/email/${templateFile}`
    );
    const source = fs.readFileSync(templatePath).toString();
    const template = Handlebars.compile(source);

    const html = template(data);

    const resolvePath = resolve("./src/presentation/public");

    const mailOption = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      html,
      attachments: [
        {
          filename: "coder.png",
          path: resolvePath + "/images/coder.png",
          cid: "coder.png",
        },
      ],
    };

    return await transport.sendMail(mailOption);
  }

  async sendForgotPassword(email) {
    const um = new UserManager();
    const user = await um.getOneByEmail(email);

    if (user.id == undefined) {
      throw new Error(`No account found with ${email}`);
    }

    const token = await generateToken(user, "1h");

    const transport = nodemailer.createTransport(this.smtp_config);

    const templatePath = resolve(
      `src/presentation/views/email/forgotPassword.hbs`
    );
    const source = fs.readFileSync(templatePath).toString();
    const template = Handlebars.compile(source);

    const html = template({
      company: "Coderhouse",
      token: `localhost:${process.env.SERVER_PORT}/api/sessions/forget-password/${token}`,
      userName: user.firstName,
      email: user.email,
      img1: "cid:coder.png",
    });

    const resolvePath = resolve("./src/presentation/public");

    const mailOption = {
      from: process.env.SMTP_SENDER_EMAIL_DEFAULT,
      to: email,
      subject: "Restablecer contraseña",
      html,
      attachments: [
        {
          filename: "coder.png",
          path: resolvePath + "/images/coder.png",
          cid: "coder.png",
        },
      ],
    };

    return await transport.sendMail(mailOption);
  }
}

export default MailManager;
