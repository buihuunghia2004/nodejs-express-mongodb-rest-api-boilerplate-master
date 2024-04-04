// import { slugify } from "~/utils/formatter"
import { userModel } from '~/models/userModel'
import { decentralization } from '~/utils/constants'
import { sendMail } from '~/utils/mailer'


const register = async (reqBody) => {
  try {
    //IF is Staff
    if (reqBody.role === decentralization.STAFF) {
      reqBody._destroy = true
    }

    const registeredUser = await userModel.register(reqBody)

    if (reqBody.role === decentralization.STAFF) {
      const data = {
        email:reqBody.email,
        subject: 'OKKK'
      }
      sendMail(data)
    }

    return registeredUser
  } catch (error) {
    throw error
  }
}

export const authService = {
  register
}