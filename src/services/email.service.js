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
  const subject = '🎉 Welcome to Bank Management'

  const text = `
        Hi ${name},

        Welcome to Bank Management!

        Your account has been created successfully.

        You can now:
        - View your account details
        - Manage transactions
        - Access banking services securely
        - Track your account activity

        If you did not create this account, please contact our support team immediately.

        Thank you for choosing Bank Management.

        Regards,
        Bank Management Team
        `
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 30px auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden;">
        
        <div style="background: #0d6efd; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">🏦 Welcome to Bank Management</h2>
        </div>

        <div style="padding: 25px; color: #333; line-height: 1.7;">
            <p>Hello <strong>${name}</strong>,</p>

            <p>
            Thank you for registering with <strong>Bank Management</strong>.
            Your account has been created successfully, and we're excited to have you on board.
            </p>

            <p><strong>With your account, you can:</strong></p>

            <ul>
            <li>💳 Manage your bank account securely</li>
            <li>💰 View your account balance and transactions</li>
            <li>📊 Track your banking activities</li>
            <li>🔒 Enjoy a safe and secure banking experience</li>
            </ul>

            <p>
            If you did not create this account, please contact our support team immediately.
            </p>

            <p>
            We look forward to serving you.<br>
            Thank you for choosing <strong>Bank Management</strong>.
            </p>

              <div style="background:#f8f9fa; border-left:4px solid #0d6efd; padding:15px; margin:20px 0;">
                <strong>🚧 Development Update</strong>
                <p style="margin:8px 0 0;">
                    Our platform is currently under development. New features and improvements
                    will be added soon to provide you with a better banking experience.
                </p>
              </div>


            <p style="margin-top:30px;">
                Best Regards,<br><br>
                <strong>Suraj Gupta</strong><br>
                Founder & CEO<br>
                Bank Management<br>
                📧 support@bankmanagement.com<br>
                🌐 https://portfolio-o3by.onrender.com/
            </p>
        </div>

        <div style="background:#f5f5f5; text-align:center; padding:15px; color:#777; font-size:13px;">
            © ${new Date().getFullYear()} Bank Management. All rights reserved.
        </div>
        </div>
`
  await sendEmail(Useremail, subject, text, html)
}

module.exports = { sendEmailToUser }
