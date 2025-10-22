import express from "express";
import sequelize from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import adminRoutes from "./routes/adminRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import { User } from "./models/user";

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Swagger
const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "ToDo API", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

const port = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(async () => {
  const adminUser = await User.findOne({ where: { username: "admin" } });
  if (!adminUser) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ username: "admin", password: hashed, isAdmin: true });
    console.log("Admin criado: username=admin, password=admin123");
  }

  app.listen(port, () => console.log(`Backend rodando em http://localhost:${port}`));
});
