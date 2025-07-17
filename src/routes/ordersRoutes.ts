import express from 'express'
import { createOrder, getOrders, updateOrderStatus } from '../controllers/OrdersController'
import { auth } from '../middleware/auth'

const router = express.Router()

router.post('/', auth, createOrder)

router.get('/my-orders', auth, getOrders)

router.patch('/:id/status', auth, updateOrderStatus)

export default router
