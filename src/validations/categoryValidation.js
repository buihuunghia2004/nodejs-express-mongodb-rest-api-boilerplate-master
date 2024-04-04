import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { CATEGORY1, CATEGORY2, CATEGORY3, SUB_CATEGORY_1, SUB_CATEGORY_2 } from '~/utils/constants'


const addNew = async (req, res, next) => {
  const categoryCorrectCondition = Joi.object({
    name: Joi.string().required().valid(CATEGORY1, CATEGORY2, CATEGORY3),
    subCategoryName: Joi.string().valid(SUB_CATEGORY_1, SUB_CATEGORY_2)
  })
  try {
    await categoryCorrectCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }

}

export const categoryValidation = {
  addNew
}