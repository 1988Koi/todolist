import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { User } from "./user";

export class Task extends Model {}

Task.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, modelName: "task" }
);

Task.belongsTo(User);
User.hasMany(Task);
