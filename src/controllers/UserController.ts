import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstname, lastname, billingAddress } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      firstname,
      lastname,
      billingAddress,
    });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  res.json({ token });
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { firstname, lastname, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.json(updatedUser);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: err.message || "Erreur lors de la mise à jour" });
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;

    if (user.role !== "admin") {
      res.status(403).json({ message: "Accès refusé" });
      return;
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
};

// Modifier un utilisateur par son ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== "admin") {
      res.status(403).json({ message: "Accès refusé" });
      return;
    }

    const { id } = req.params;
    const { firstname, lastname, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstname, lastname, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.json(updatedUser);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: err.message || "Erreur lors de la mise à jour" });
  }
};

// Supprimer un utilisateur par son ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== "admin") {
      res.status(403).json({ message: "Accès refusé" });
      return;
    }

    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
};
