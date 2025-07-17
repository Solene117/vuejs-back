import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";

const validStatuses = ["En attente", "Payée", "Annulée", "Livrée", "En cours"];
// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { items, total, billingAddress, shippingAddress } = req.body;

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Produit ${item.name} introuvable.` });
      }

      if (product.unit < item.quantity) {
        return res
          .status(400)
          .json({ message: `Stock insuffisant pour le produit ${item.name}.` });
      }

      product.unit -= item.quantity;
      await product.save();
    }

    // Créer la commande
    const order = new Order({
      user: userId,
      items,
      total,
      status: "En attente",
      billingAddress,
      shippingAddress,
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export async function getOrders(req: Request, res: Response) {
  try {
    const user = req.user;
    let orders;
    if (user.role === "admin") {
      orders = await Order.find()
        .populate("user", "firstname lastname")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: user._id })
        .populate("user", "firstname lastname")
        .sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  const orderId = req.params.id;
  const { status } = req.body;

  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès refusé : rôle admin requis" });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Statut mis à jour", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
