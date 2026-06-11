import { createServer } from "http";
import { app } from "./app.ts";
import { env } from "./config/env.ts";
import { logger } from "./config/logger.ts";

const server = createServer(app);

server.listen(env.PORT, () => {
    logger.info(`Server started on port ${env.PORT}`);
});
