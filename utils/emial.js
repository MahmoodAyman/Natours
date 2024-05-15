const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');
const sendEmail = catchAsync(async (options) => {
  // create transporter
  const transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // define the email options
  const mailOptions = {
    from: 'Ayman <admin@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // send the email
  await transporter.sendMail(mailOptions, (err, inf) => {
    if (err) {
      console.log(err);
    } else {
      console.log(inf);
    }
  });
});
module.exports = sendEmail;
