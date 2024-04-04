import { StatusCodes } from 'http-status-codes'
import { orderModel } from '~/models/orderModel'

//GET
const getOrdersByStatus = async (req, res, next) => {
  try {
    const orders = await orderModel.getOrdersByStatus(Number(req.query.status))

    res.status(StatusCodes.OK).json({
      status:true,
      data:orders
    })
  } catch (error) {
    next(error)
  }
}
//POST
const createNewOrder = async (req, res, next) => {
  try {
    const uid = req.params.id
    const data = {
      ...req.body,
      uid
    }
    const newOrder = await orderModel.createNewOrder(data)

    res.status(StatusCodes.OK).json(newOrder)
  } catch (error) {
    next(error)
  }
}
//PUT
const updateStatus = async (req, res, next) => {
  try {
    const updated = await orderModel.updateStatus(req.body)

    res.status(StatusCodes.OK).json(updated)
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  createNewOrder, updateStatus,
  getOrdersByStatus
}