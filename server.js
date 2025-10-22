import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import consola from "consola";


import morgan from "morgan";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./Config/db.js";
import initSocket from "./Sockets/socketHandler.js";

// Import des routes
import authRouter from "./Routes/authRouter.js";
import userRouter from "./Routes/userRouter.js";
import articleRouter from "./Routes/articleRouter.js";
import commentRouter from "./Routes/commentRouter.js";
import notificationRouter from "./Routes/notificationRouter.js";

// Initialisation
const app = express();
const server = http.createServer(app); // Nécessaire pour Socket.io
initSocket(server); // Initialise la logique Socket.io

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// Servir les images uploadées
const dirname = path.resolve(); // dossier racine du backend
app.use('/uploads', express.static(path.join(dirname, 'uploads')));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api/notifications", notificationRouter);
connectDB();

// Variables d’environnement
const PORT = process.env.APP_PORT ;
const DOMAIN = process.env.APP_DOMAIN ;

// Démarrage du serveur
server.listen(PORT, async () => {
  try {
    consola.success({
      message: `🚀 Server started on PORT ${PORT} - URL: ${DOMAIN}:${PORT}`,
      badge: true,
    });
  } catch (err) {
    consola.error({
      message: `❌ Error starting the server`,
      badge: true,
    });
  }
});
