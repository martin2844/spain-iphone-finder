const nodemailer = require("nodemailer");
const dayjs = require("dayjs");
const day = dayjs(Date.now()).format("DD/MM/YYYY HH:mm:ss");
// async..await is not allowed in global scope, must use a wrapper
async function main(iphones) {
  console.log(process.env.DO_NOT_REPLY_EMAIL);
  // create reusable transporter object using the default SMTP transport
  let transport = nodemailer.createTransport({
    host: "smtp.pepipost.com",
    port: 25,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transport.sendMail({
    from: "no-responder@faduense.com", // sender address
    to: "martin2844@gmail.com", // list of receivers
    subject: `Iphones Found - ${day} `, // Subject line
    html: iphones.map((i) => `<p>${i}</p>`).join(), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main;
