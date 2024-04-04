import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { decentralization } from '~/utils/constants'
import { EMAIL, PASSWORD, PHONENUMBER, ROLE, STATUS_CODE_ERROR_VALIDATION, STRING } from '~/utils/validatorConstant'

const register = async (req, res, next) => {
  const correctContiodion = Joi.object({
    userName: Joi.string().trim().strict().required(),
    email: EMAIL.strict().required(),
    phoneNumber: PHONENUMBER.strict().required(),
    password: PASSWORD.strict().required(),
    role: ROLE.default(decentralization.CUSTOMER)
  })

  try {
    await correctContiodion.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    console.log('___Register_Validation: ',error)
    res.status(STATUS_CODE_ERROR_VALIDATION).json(
      {
        status: false,
        statusCode:STATUS_CODE_ERROR_VALIDATION,
        message:error.details[0].message
      }
    )
  }
}

const login = async (req, res, next) => {
  const correctContiodion = Joi.object({
    email: EMAIL.strict().required(),
    password: PASSWORD.strict().required()
  })

  try {
    await correctContiodion.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    console.log('___Login_Validation: ',error)
    res.status(STATUS_CODE_ERROR_VALIDATION).json({
      statusCode:STATUS_CODE_ERROR_VALIDATION,
      status:false,
      message:error.details[0].message
    })
  }
}


export const authValidation = {
  register,
  login
}