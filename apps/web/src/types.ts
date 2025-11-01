import { Prisma } from "@bibas/prisma";
import type { authClient } from "./lib/auth-client";

export type Conversation = Prisma.ConversationGetPayload<{
  include: {
    Users: true;
  };
}>;

export type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: {
    Users: true;
    Messages: {
      include: {
        Sender: true;
      };
    };
  };
}>;

export type SessionUser = Awaited<ReturnType<typeof authClient.getSession>>;
