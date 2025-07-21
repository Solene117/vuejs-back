import express from 'express'
import { createOrder, getOrders, updateOrderStatus, generatePDF } from '../controllers/OrdersController'
import { auth } from '../middleware/auth'

const router = express.Router()

router.post('/', auth, createOrder)

router.get('/my-orders', auth, getOrders)

router.patch('/:id/status', auth, updateOrderStatus)

router.get('/:id/pdf', auth, generatePDF)

export default router
