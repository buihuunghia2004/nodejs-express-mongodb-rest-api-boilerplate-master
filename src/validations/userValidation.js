import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { EMAIL, NUMBER, PHONENUMBER, PROPS, STRING, URL, ID, ARRAY_OBJECT } from '~/utils/validatorConstant'

const updateInfo = async (req, res, next) => {
  const infoCorrectCondition = Joi.object({
    userName: STRING.strict(),
    email: EMAIL.strict(),
    phoneNumber: PHONENUMBER,
    linkAvatar: URL,
    address:STRING
  })

  try {
    await ID.validateAsync(req.params.id)
    await infoCorrectCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    console.log('___UpdateInfo Validation: ', error.details);
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: false,
      message: 'New info not valid'
    })
  }
}

const updateCart = async (req, res, next) => {
  const itemValid = Joi.object({
    id: ID.strict().required(),
    linkImage: URL.strict().required(),
    name: STRING.strict().required(),
    prop: PROPS,
    price: NUMBER.strict().required(),
    quantity: NUMBER.strict().min(1).required()
  })

  const cartValid = ARRAY_OBJECT(itemValid).unique((a,b) => a.id === b.id)
  try {
    await ID.validateAsync(req.params.id)
    const cart = req.body
    await cartValid.validateAsync(cart, { abortEarly: false })

    next()
  } catch (error) {
    console.log('___updateCart_Validate Error: ', error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: false,
      message: error.details.map(item => item.message)
    })
  }
}



export const userValidation = {
  updateInfo,
  updateCart
}