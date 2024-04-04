import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { AVATAR_URL_DEFAULT, decentralization } from '~/utils/constants'
import { ARRAY_OBJECT, BOOLEAN, EMAIL, ID, NUMBER, PASSWORD, PHONENUMBER, QUANTITY, ROLE, STRING, TIME_STAMP, URL } from '~/utils/validatorConstant'
import { orderModel } from './orderModel'
import { StatusCodes } from 'http-status-codes'

const itemDeliveryAddress = Joi.object({
  receiverName: STRING,
  phoneNumber: PHONENUMBER,
  address: STRING
})

const itemCart = Joi.object({
  id: ID.required(),
  name: STRING.required(),
  price: NUMBER.min(0).required(),
  prop: STRING,
  linkImage: URL.required(),
  quantity: NUMBER.min(1)
})

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: EMAIL.required(),
  password: PASSWORD.required(),
  userName: STRING.required(),
  phoneNumber: PHONENUMBER.required(),
  linkAvatar: URL.default(AVATAR_URL_DEFAULT),
  deliveryAddress: ARRAY_OBJECT(itemDeliveryAddress).default([{}]),
  cart: ARRAY_OBJECT(itemCart).default([]),
  orders: ARRAY_OBJECT(orderModel.ORDER_COLLECTION_SCHEMA).default([]),
  role: ROLE.default(decentralization.CUSTOMER),

  createdAt: TIME_STAMP.default(Date.now),
  updatedAt: TIME_STAMP.default(null),
  _destroy: BOOLEAN.default(false)
})

const getUserByEmail = async (email) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email })

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Not found user by email')
    }

    return user
  } catch (error) {
    throw error
  }
}
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

//REGISTER
const register = async (reqBody) => {
  try {
    //Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashed = await bcryptjs.hash(reqBody.password, salt)
    reqBody.password = hashed

    //Check email is exist
    try {
      const user = await getUserByEmail(reqBody.email)
      if (user) {
        throw new ApiError(422, 'The email is use')
      }
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error
      }
    }


    //Create new user and validate
    const validUser = await validateBeforeCreate(reqBody)
    validUser.deliveryAddress[0] = {
      receiverName: validUser.userName,
      phoneNumber: validUser.phoneNumber,
      address: ''
    }
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validUser)

    //OK
    if (result.acknowledged) {
      return {
        status: true,
        data: result.insertedId
      }
    }

    //Fail
    return {
      status: false,
      message: 'Can not create user'
    }

  } catch (error) {
    console.log('___Register Error: ', error);
    throw error
  }
}
//LOGIN
const login = async (data) => {
  try {
    const { email, password } = data

    //find User by email
    const user = await GET_DB().collection(USER_COLLECTION_NAME)
      .findOne(
        { email: email },
        {
          projection: {
            role: 0,
            createdAt: 0,
            updatedAt: 0,
            _destroy: 0
          }
        }
      )

    if (!user) {
      throw new ApiError(401, 'Not found email')
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(402, 'Wrong password')
    }

    delete user.password

    return user
  } catch (error) {
    throw error
  }
}

//GET
const getUserById = async (id) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Not found user')
    }

    return user
  } catch (error) {
    throw error
  }
}

const getInfoById = async (id) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          password: 0,
          createdAt: 0,
          updatedAt: 0
        }
      }
    )

    if (!user) {
      throw new ApiError(404, 'Not found user')
    }

    return user
  } catch (error) {
    throw error
  }
}

const veryfiEmail = async (req, res, next) => {
  const { email, code } = req.query
  console.log(email, 'email');
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate({ email: email }, { $set: { _destroy: false } })

    return user
  } catch (error) {
    throw new Error(error)
  }
}
//UPDATE
const updateInfo = async (req) => {
  const { userName, email, linkAvatar, phoneNumber, address } = req.body
  const id = new ObjectId(req.params.id)
  try {
    //find user by id
    const currentUser = await getUserById(id)

    if (!currentUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Not found user by id : ${id}`)
    }

    const newInfo = {}

    if (userName) {
      newInfo.userName = userName
    }
    if (linkAvatar) {
      newInfo.linkAvatar = linkAvatar
    }
    if (phoneNumber) {
      newInfo.phoneNumber = phoneNumber
    }
    if (address) {
      const deliveryAddress = {
        receiverName: userName,
        phoneNumber: phoneNumber,
        address: address
      }
      newInfo.deliveryAddress = deliveryAddress
    }

    if (email) {
      console.log(email);
      try {
        const userEmail = await getUserByEmail(email)
        console.log(userEmail,'uuuuuuuuuuuuuuuuuuuuuuuuuu');
        if (userEmail) {
          throw new ApiError(400, 'The email is already in use')
        }
        
      } catch (error) {
        newInfo.email = email
      }
    }

    const newUser = await GET_DB().collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: id },
        { $set: newInfo },
        { returnDocument: 'after' }
      )

    if (!newUser) {
      throw new ApiError(500, 'Udate fail')
    }

    return newUser
  } catch (error) {
    throw error
  }
}

const updateCart = async (data) => {
  const { cart, uid } = data
  try {
    const updatedCart = await GET_DB().collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(uid) },
        { $set: { cart: cart } },
        { returnDocument: "after" }
      )

    return {
      status: true,
      data: updatedCart.cart
    }
  } catch (error) {
    throw error
  }
}

const updateOrderStatus = async (data) => {
  const { uid, orderId, itemStatus } = data
  try {
    const updatedCart = await GET_DB().collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(uid), 'orders.id': orderId },
        { $push: { 'orders.$.status': itemStatus } },
      )

    return updatedCart
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  //auth
  register, login,
  //Update
  updateOrderStatus,
  updateInfo,
  updateCart,
  //GET
  getInfoById, veryfiEmail, getUserById
}
