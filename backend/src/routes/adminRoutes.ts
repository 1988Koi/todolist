import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = Router();

/**
 * @swagger
 * /admin/get-token:
 *   get:
 *     summary: Gera token JWT do admin fixo (para teste)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Retorna token JWT do admin
 */
router.get("/get-token", async (req, res) => {
  const admin = await User.findOne({ where: { username: "admin" } });
  if (!admin) return res.status(500).json({ message: "Admin não encontrado" });

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ token });
});

export default router;
