import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface SendMailtype {
  send_to: any;
  subject: any;
  message: any;
}

const SendMail = async ({send_to, subject, message}: SendMailtype) => {
  try {
    console.log("send_to", send_to);
    console.log("subject", subject);
    console.log("message", message);
    if (!send_to || !subject || !message) {
      throw new Error("Missing required fields: send_to, subject, or message");
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const option = {
      from: process.env.EMAIL_USER,
      to: send_to, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    };

   await transporter.sendMail(option);
  } catch (error: any) {
    console.log(error.message);
  }
};
export default SendMail;
