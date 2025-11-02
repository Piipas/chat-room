import { Elysia, t } from "elysia";
import { auth } from "../lib/auth";
import { cors } from "@elysiajs/cors";
import conversationRoutes from "./routes/conversation-routes";
import websocketRoutes from "./routes/websocket-routes";

const init = new Elysia()
  .use(
    cors({
      origin: process.env.TRUSTED_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return status(401);
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

const app = new Elysia().use(init);
conversationRoutes(app);
websocketRoutes(app);

app.listen(process.env.PORT || 4000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export default app;
