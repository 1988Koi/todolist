import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskcontroller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Rotas de gerenciamento de tarefas
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Listar todas as tasks do usuário
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tasks
 */
router.get("/", authMiddleware, getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Criar nova task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task criada
 */
router.post("/", authMiddleware, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualizar task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task atualizada
 *       404:
 *         description: Task não encontrada
 */
router.put("/:id", authMiddleware, updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Deletar task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deletada
 *       404:
 *         description: Task não encontrada
 */
router.delete("/:id", authMiddleware, deleteTask);

export default router;
