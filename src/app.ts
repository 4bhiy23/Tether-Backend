import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";

export const app = express();

app.use(
    cors({
        origin: env.FRONTEND_URL,
        credentials: true,
    }),
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestContext);

// Better-Auth
import { toNodeHandler } from "better-auth/node";
app.all("/api/auth/*splat", toNodeHandler(auth));


// Swagger setup
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/docs.json", (_, res) => {
    res.json(swaggerSpec);
});


// Mount routes here later
import healthRouter from "./modules/health/health.routes.js";
import { errorHandler } from "./shared/errors/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";
import { auth } from "./lib/auth.js";
import userRouter from "./modules/users/tetherUsers.routes.js";


app.use("/v1/api/health", healthRouter);
app.use("/v1/api/users", userRouter);

// app.use("/api/profiles", profileRoutes);
// app.use("/api/conversations", conversationRoutes);
// app.use("/api/messages", messageRoutes);



// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handler should be last
app.use(errorHandler);