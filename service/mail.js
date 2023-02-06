import { config } from "dotenv";
config();
import { createTransport } from "nodemailer";

class MailService {
  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  async sendActivationLink(to, activationLink) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Активация аккаунта на сайте ${process.env.API_URI}`,
      html: `
            <h1>Чтобы активировать аккаунт нужно перейте по ссылки</h1>
            <a href="${activationLink}">${activationLink}</a>
        `,
    });
  }
}
export default new MailService();
