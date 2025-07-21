import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import PDFDocument from 'pdfkit'

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

export const generatePDF = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id
    const order = await Order.findById(orderId).populate("user", "firstname lastname email") as any

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' })
    }

    const doc = new PDFDocument({ margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=facture-${orderId}.pdf`)

    doc.pipe(res)

    const primaryColor = '#3b82f6' 
    const grayColor = '#6b7280'    

    doc
      .fillColor(primaryColor)
      .fontSize(24)
      .text('FACTURE', 50, 50)

    doc
      .moveTo(50, 80)
      .lineTo(550, 80)
      .strokeColor(primaryColor)
      .stroke()

    const startY = 100

    doc
      .fontSize(12)
      .fillColor(grayColor)
      .text('Facturé à:', 50, startY)
      .fillColor('black')
      .font('Helvetica-Bold')
      .text(`${order.user.firstname} ${order.user.lastname}`, 50, startY + 15)
      .font('Helvetica')
      .text(order.user.email, 50, startY + 35)
      .moveDown()

    if (order.billingAddress) {
      const addr = order.billingAddress
      doc.text(`${addr.street}`, 50, startY + 75)
      doc.text(`${addr.postalCode} ${addr.city}`, 50, startY + 90)
      doc.text(`${addr.country}`, 50, startY + 105)
    }

    const rightColumnX = 350
    doc
      .fillColor(grayColor)
      .text('Date:', rightColumnX, startY)
      .fillColor('black')
      .text(new Date(order.createdAt).toLocaleDateString(), rightColumnX, startY + 15)
      .fillColor(grayColor)
      .text('N° commande:', rightColumnX, startY + 40)
      .fillColor('black')
      .text(order._id.toString(), rightColumnX, startY + 55)
      .moveDown()

    const tableTop = startY + 140
    const descriptionX = 100
    const quantityX = 320
    const priceX = 380
    const totalX = 460

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Article', descriptionX, tableTop)
      .text('Quantité', quantityX, tableTop, { width: 50, align: 'right' })
      .text('Prix Unitaire', priceX, tableTop, { width: 80, align: 'right' })
      .text('Total', totalX, tableTop, { width: 70, align: 'right' })

    doc
      .moveTo(50, tableTop + 20)
      .lineTo(550, tableTop + 20)
      .strokeColor(primaryColor)
      .stroke()

    let yPosition = tableTop + 30
    doc.font('Helvetica').fillColor('black').fontSize(12)

    order.items.forEach((item: any, i: number) => {
      const lineTotal = item.quantity * item.price
      doc.text(item.name, descriptionX, yPosition)
      doc.text(item.quantity.toString(), quantityX, yPosition, { width: 50, align: 'right' })
      doc.text(item.price.toFixed(2) + ' €', priceX, yPosition, { width: 70, align: 'right' })
      doc.text(lineTotal.toFixed(2) + ' €', totalX, yPosition, { width: 70, align: 'right' })
      yPosition += 20
    })

    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Total à payer:', priceX, yPosition + 20, { width: 100, align: 'right' })
      .text(order.total.toFixed(2) + ' €', totalX, yPosition + 20, { width: 70, align: 'right' })

    doc
      .fontSize(10)
      .fillColor(grayColor)
      .text('Merci pour votre commande !', 50, 700, { align: 'center', width: 500 })

    doc.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur lors de la génération du PDF' })
  }
}
