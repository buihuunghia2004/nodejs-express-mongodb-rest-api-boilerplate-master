import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { SIZE_CONSTANT } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, STRING, NUMBER, ARRAY_OBJECT, URL, SIZE, ID, STATUS_CODE_ERROR_VALIDATION } from '~/utils/validatorConstant'


const addNewProduct = async (req, res, next) => {
  const producCorrectCondition = Joi.object({
    categoryId: ID.strict().required(),
    name: STRING.strict().required(),
    price: NUMBER.required(),
    quantity: NUMBER.min(1).required(),
    linkImages: ARRAY_OBJECT(URL).required(),
    size: SIZE.required(),
    prop:STRING,
    madein: STRING
  })

  try {
    await producCorrectCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    res.status(STATUS_CODE_ERROR_VALIDATION).json({
      status:false,
      message:error.details[0].message
    })
  }
}

const updateProduct = async (req, res, next) => {
  const producCorrectCondition = Joi.object({
    categoryId: ID.strict(),
    name: STRING.strict(),
    price: NUMBER,
    quantity: NUMBER.min(1),
    linkImages: ARRAY_OBJECT(URL),
    size: SIZE,
    prop:STRING,
    madein: STRING
  })

  try {
    await producCorrectCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    res.status(STATUS_CODE_ERROR_VALIDATION).json({
      status:false,
      message:error.details[0].message
    })
  }
}

const getProductsByCategory = async (req, res, next) => {
  const pageCorCon = NUMBER.min(1)
  const limitCorCon = NUMBER.min(1)
  try {
    await ID.validateAsync(req.query.categoryId)
    await pageCorCon.validateAsync(Number(req.query.page))
    await limitCorCon.validateAsync(Number(req.query.limit))
    
    next()
  } catch (error) {
    res.status(STATUS_CODE_ERROR_VALIDATION).json({
      status:false,
      message:error.details[0].message
    })
  }
}


const updateQuantity = async (req, res, next) => {
  const idCorrectCondition = Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  const quantityCorrectCondition = Joi.number()

  try {
    console.log(req.query.categoryId)
    await idCorrectCondition.validateAsync(req.params.id)
    await quantityCorrectCondition.validateAsync(req.body.quantity)

    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const productValidation = {
  addNewProduct,
  getProductsByCategory,
  updateQuantity,updateProduct
}