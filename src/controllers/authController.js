import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import { authService } from '~/services/authService'

const register = async (req, res, next) => {
  try {
    const registeredUser = await authService.register(req.body)

    res.status(StatusCodes.CREATED).json({
      status: true,
      data: registeredUser
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const logged = await userModel.login(req.body)

    res.status(StatusCodes.OK).json({
      status: true,
      data: logged
    })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  register,
  login
}