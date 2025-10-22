import { Server } from "socket.io";

export let io;

/**
 * Initialize Socket.IO server and handle article and user rooms.
 * @param {http.Server} server - The HTTP server instance
 * @returns {Server} io - Initialized Socket.IO server
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("joinArticle", (articleId) => {
      socket.join(`article:${articleId}`);
    });

    socket.on("joinUser", (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
export default initSocket;
