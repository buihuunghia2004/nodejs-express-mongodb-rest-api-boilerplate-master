import Joi, { date } from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { CANCEL_FROM_ADMIN, CANCEL_FROM_USER, NEXT_ACTION, PENDING, PROCESSING, SENT, SUCCESSFUL, USER_CANCEL_ACTION } from '~/utils/Constants/orderStatus'
import { ARRAY_OBJECT, ID, NUMBER, PHONENUMBER, STRING, TIME_STAMP, URL } from '~/utils/validatorConstant'
import { productModel } from './productModel'
import { StatusCodes } from 'http-status-codes'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  uid: ID.required(),
  receiverName: STRING.required(),
  phoneNumber: PHONENUMBER.required(),
  address: STRING.required(),

  items: ARRAY_OBJECT({
    id: ID,
    name: STRING,
    price: NUMBER.min(0),
    linkImage: URL,
    quantity: NUMBER,

  }).required(),

  total: NUMBER,
  status: ARRAY_OBJECT({
    timeStamp: TIME_STAMP.default(new Date()),
    process: NUMBER.valid(PENDING, PROCESSING, SENT, SUCCESSFUL, CANCEL_FROM_USER, CANCEL_FROM_ADMIN).default(PENDING)
  }),
  currentStatus: Joi.object({
    timeStamp: TIME_STAMP.default(new Date()),
    process: NUMBER.valid(PENDING, PROCESSING, SENT, SUCCESSFUL, CANCEL_FROM_USER, CANCEL_FROM_ADMIN).default(PENDING)
  })
})

//GET
const getOrderById = async (id) => {
  try {
    const order = await GET_DB().collection(ORDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Not found order')
    }
    return order
  } catch (error) {
    throw error
  }
}
const getOrdersByStatus = async (status) => {
  try {
    const result = GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({ 'currentStatus.process': status })
      .sort({ 'currentStatus.timeStamp': 1 })


    const orders = await result.toArray()
      .then((res) => {
        console.log(res)
        return res
      })
      .catch((err) => { throw new Error('err') })

    return orders
  } catch (error) {
    return error
  }
}

const getAllOrders = async () => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find()
    const orders = await result.toArray()
      .then(res => { return res })
      .catch(error => { throw error })

    return orders
  } catch (error) {
    throw error
  }
}

const validDataBeforeHandle = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
//POST
const createNewOrder = async (data) => {
  const { uid, receiverName, phoneNumber, address, items } = data
  try {
    //check user is exist
    await userModel.getUserById(uid)
    //get list id products
    const idProducts = items.map(item => new ObjectId(item.id))
    //get list products by id
    const products = await GET_DB().collection(productModel.PRODUCT_COLLECTION_NAME).
      find(
        { _id: { $in: idProducts } },
        {
          projection: {
            quantity: 1,
            name: 1,
            price: 1,
            linkImages: 1
          }
        }
      ).toArray()
      .then((products) => {
        //check product is exist
        if (products.length < items.length) {
          throw new ApiError(404, 'Not found item')
        }
        return products
      })

    //init order and total  
    const newOrder = { uid, receiverName, phoneNumber, address, items: [] }
    let total = 0

    for (let index = 0; index < products.length; index++) {
      //check quantity
      if (items[index].quantity > products[index].quantity) {
        throw new ApiError(422, 'Product out of stock')
      }

      products[index].quantity = items[index].quantity

      products[index].id = products[index]._id.toString()
      products[index].linkImage = products[index].linkImages[0]
      delete products[index]._id
      delete products[index].linkImages

      //push item to order and set total
      newOrder.items.push(products[index])
      total += products[index].price
    }

    newOrder.total = total
    newOrder.status = [{}]
    newOrder.currentStatus = {}
    const validOrder = await ORDER_COLLECTION_SCHEMA.validateAsync(newOrder, { abortEarly: false })
    await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(validOrder)

    setTimeout(async () => {
      //update order of user
      delete validOrder.uid
      validOrder.id = validOrder._id.toString()
      delete validOrder._id

      await GET_DB().collection(userModel.USER_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(uid) },
          { $push: { orders: validOrder } }
        )

      //reduce quantity before buy success
      items.forEach(async element => {
        await GET_DB().collection(productModel.PRODUCT_COLLECTION_NAME)
          .findOneAndUpdate(
            { _id: new ObjectId(element.id) },
            { $inc: { quantity: - element.quantity } }
          )
      });

      //set cart for user
      // const cartOfUser = await
    }, 0);


    return validOrder
  } catch (error) {
    throw error
  }
}

//PUT
const updateStatus = async (data) => {
  const { id, action } = data
  try {
    const order = await getOrderById(id)
    const currentProcess = order.status.pop().process

    console.log(currentProcess);

    if (currentProcess < 0 || currentProcess === SUCCESSFUL) {
      throw new ApiError(422, 'Can not do action')
    }

    const newStatus = {
      timeStamp: new Date(),
    }

    switch (action) {
      case NEXT_ACTION:
        newStatus.process = currentProcess + 1
        break;
      case CANCEL_FROM_USER:
        newStatus.process = CANCEL_FROM_USER
        break;
      case CANCEL_FROM_ADMIN:
        newStatus.process = CANCEL_FROM_ADMIN
        break;
      default:
        throw new ApiError(444, 'Not found process')
    }

    const updatedOrder = await GET_DB().collection(ORDER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $push: { status: newStatus },
          $set: { currentStatus: newStatus }
        },
        { returnDocument: "after" }
      )

    if (!updatedOrder) {
      throw new ApiError(422, 'Can not update status')
    }

    //update for user
    setTimeout(async () => {
      await userModel.updateOrderStatus({ uid: order.uid, orderId: id, itemStatus: newStatus })
    }, 0);

    return {
      status: true,
      data: updatedOrder
    }
  } catch (error) {
    throw error
  }
}

export const orderModel = {
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA,
  createNewOrder,
  updateStatus,
  getOrdersByStatus
}