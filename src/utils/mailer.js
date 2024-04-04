import nodemailer from 'nodemailer'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './constants'

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_PASSWORD
  }
})

export const sendMail = async (data) => {
  try {
    const { email, subject, content } = data
    const mailOptions = {
      from: ADMIN_EMAIL,
      to: email,
      subject,
      html: content
    }
    await transporter.sendMail(mailOptions)
    return true
  }
  catch (error) {
    console.log(error)
    throw new Error('Có lỗi xảy ra khi gửi email')
  }
}