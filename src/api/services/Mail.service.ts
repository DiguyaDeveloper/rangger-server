import * as nodemailer from 'nodemailer';

class Mail {
  constructor(
    public to?: string,
    public subject?: string,
    public message?: string,
    public context?: any,
    public template?: string) {
  }

  sendMail() {
    const path = require('path');
    const hbs = require('nodemailer-express-handlebars');

    let mailOptions = {
      from: "visitantesilvapc@gmail.com",
      to: this.to,
      subject: this.subject,
      context: this.context,
      template: this.template
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
          user: "msg.shawime@gmail.com",
          pass: "miwesha2020"
      },
      tls: { rejectUnauthorized: false }
    });


    transporter.use('compile', hbs({
      viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/public/template/')
      },
      viewPath: path.resolve('./src/public/template/'),
      extName: '.html',
    }));

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return error;
      } else {
        console.log("E-mail enviado com sucesso!")
        return "E-mail enviado com sucesso!";
      }
    });
  }

}


export default new Mail;
