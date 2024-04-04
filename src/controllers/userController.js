import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'

//GET
const getInfoById = async (req, res, next) => {
  try {
    const userInfo = await userModel.getInfoById(req.params.id)

    res.status(StatusCodes.OK).json({
      status:true,
      data:userInfo
    })
  } catch (error) {
    next(error)
  }
}

const veryfiEmail = async (req, res, next) => {
  try {
    const veryfi = await userModel.veryfiEmail(req)

    res.status(StatusCodes.OK).json({ st: true, message: 'xác thực thành công' })
  } catch (error) {
    next(error)
  }
}
//UPDATE 
const updateInfoUser = async (req, res, next) => {
  try {
    const updatedInfoUser = await userModel.updateInfo(req)

    res.status(StatusCodes.OK).json(updatedInfoUser)
  } catch (error) {
    next(error)
  }
}

const updateCart = async (req, res, next) => {
  try {
    const data = {
      uid: req.body,
      cart: req.params.id
    }

    const updatedCart = await userModel.updateCart(data)

    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) {
    next(error)
  }
}


export const userController = {
  updateInfoUser,
  updateCart,
  getInfoById, veryfiEmail
}