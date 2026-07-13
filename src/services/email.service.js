const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
  }
})

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error)
  } else {
    console.log('Email server is ready to send messages')
  }
})

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank-Management" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html // html body
    })

    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

const sendEmailToUser = async (Useremail, name) => {
  console.log('Welcome to send mail to the user')
  const subject = 'Welcome to Bank-Management'
  const text = `Hello ${name},\n\nWelcome to Bank-Management! We are excited to have you join our community.\n\nBest regards,\nBank-Management Team`
  const html = `<p>Hello ${name},</p>\n<p>Welcome to Bank-Management! We are excited to have you join our community.</p>\n<p>Best regards,<br>Bank-Management Team</p>`
  await sendEmail(Useremail, subject, text, html)
}

module.exports = { sendEmailToUser }
