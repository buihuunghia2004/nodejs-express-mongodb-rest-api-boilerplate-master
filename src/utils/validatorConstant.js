import Joi from 'joi'
import { CATEGORY, PROP, SIZE_CONSTANT, decentralization, size } from './constants'

export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const PHONENUMER_REGEX = /^[0-9]{10,11}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const STRING = Joi.string().trim()
export const NUMBER = Joi.number()
export const BOOLEAN = Joi.boolean()

//user
export const ID = STRING.pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
export const EMAIL = STRING.email()
export const PHONENUMBER = STRING.pattern(PHONENUMER_REGEX)
export const URL = STRING.uri()
export const PASSWORD = STRING.min(6)
export const ROLE = NUMBER.valid(decentralization.ADMIN, decentralization.CUSTOMER, decentralization.STAFF)

//product
export const SIZE = NUMBER.valid(SIZE_CONSTANT.SMALL, SIZE_CONSTANT.MEDIUM, SIZE_CONSTANT.LARGE)

export const CATEGORY_NAME = STRING.valid(CATEGORY.CROPS, CATEGORY.POTS, CATEGORY.ACCESSORIES)
export const PROPS = STRING.valid(PROP.SHADE_LOVE, PROP.LIGHT_LOVE )

export const QUANTITY = NUMBER.min(1)
export const TIME_STAMP = Joi.date().timestamp('javascript')//default(Date.now)

export const ARRAY_OBJECT = (item) => {
  return Joi.array().items(item)
}


//error
export const STATUS_CODE_ERROR_VALIDATION = 451