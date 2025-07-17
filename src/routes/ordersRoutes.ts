import express from 'express'
import { createOrder, getOrders } from '../controllers/OrdersController'
import { auth } from '../middleware/auth'

const router = express.Router()

router.post('/', auth, createOrder)

router.get('/my-orders', auth, getOrders)

export default router
