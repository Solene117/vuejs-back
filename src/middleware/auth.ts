import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/User'  // importe ton modèle User

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token manquant' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

    if (!decoded.id) {
      return res.status(401).json({ message: 'Token invalide' })
    }

    const user = await User.findById(decoded.id).select('_id role')

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' })
    }

    (req as any).user = {
      _id: user._id,
      role: user.role
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' })
  }
}
