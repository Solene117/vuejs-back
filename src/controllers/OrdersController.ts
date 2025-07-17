import { Request, Response } from 'express'
import Order from '../models/Order'
import Product from '../models/Product';

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { items, total } = req.body;

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.name} introuvable.` });
      }

      if (product.unit < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour le produit ${item.name}.` });
      }

      product.unit -= item.quantity;
      await product.save();
    }

    // Créer la commande
    const order = new Order({
      user: userId,
      items,
      total,
      status: 'en attente', 
    });

    await order.save();

    res.status(201).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/orders/my-orders
export async function getOrders(req: Request, res: Response) {
  try {
    const user = req.user 
    let orders
    if (user.role === 'admin') {
      orders = await Order.find().sort({ createdAt: -1 })
    } else {
      orders = await Order.find({ user: user.id }).sort({ createdAt: -1 })
    }

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
