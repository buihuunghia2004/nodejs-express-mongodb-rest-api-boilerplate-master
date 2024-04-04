import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { EMAIL, NUMBER, PHONENUMBER, PROPS, STRING, URL, ID, ARRAY_OBJECT } from '~/utils/validatorConstant'

const createNewOrder = async (req, res, next) => {
  const orderValidate = Joi.object({
    receiverName: STRING.required(),
    address: STRING.required(),
    phoneNumber: PHONENUMBER.required(),
    items: ARRAY_OBJECT(Joi.object({
      id: ID.required(),
      quantity: NUMBER.min(1).strict().required(),
    })).unique((a, b) => a.id === b.id)
  })
  try {
    await ID.validateAsync(req.params.id)
    await orderValidate.validateAsync(req.body, { abortEarly: false })

    console.log('okokok');
    next()
  } catch (error) {
    console.log('___createOrder_Validate Error: ', error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: false,
      message: error.details.map(item => item.message)
    })
  }
}



export const orderValidation = {
  createNewOrder
}