import { Request, Response } from "express";
import { Task } from "../models/task";

// Listar todas as tasks do usuário
export const getTasks = async (req: any, res: Response) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar tasks" });
  }
};

// Criar nova task
export const createTask = async (req: any, res: Response) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar task" });
  }
};

// Atualizar task
export const updateTask = async (req: any, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task não encontrada" });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar task" });
  }
};

// Deletar task
export const deleteTask = async (req: any, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task não encontrada" });
    await task.destroy();
    res.json({ message: "Task deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar task" });
  }
};
