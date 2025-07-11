import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const auth = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Accès refusé. Pas de token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded; // contient l'ID
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
