import { prisma } from "@bibas/prisma";
import { parseCookies } from "better-auth/cookies";
import { auth } from "../../lib/auth";

const connections = new Map<string, any>();

export const handlelBeforeHandle = async (ws: any) => {
  try {
    const cookies = parseCookies(ws.headers.cookie);
    const sessionToken = cookies.get("better-auth.session_token");

    const session = await auth.api.getSession({ headers: { cookie: `better-auth.session_token=${sessionToken}` } });

    if (!session?.user) return { error: "Unauthorized" };
    ws.user = session.user;
  } catch (error) {
    console.error("Error in beforeHandle:", error);
  }
};

export const handleOpen = (ws: any) => {};

export const handleMessage = async (ws: any, message: any) => {
  try {
    switch (message.type) {
      case "join":
        if (!connections.has(message.conversationId)) {
          connections.set(message.conversationId, new Map());
        }
        connections.get(message.conversationId)?.set(ws.data.user.id, ws);
        break;

      case "private_message":
        const userId = ws.data.user.id;

        await prisma.message.create({
          data: {
            content: message.content,
            senderId: userId,
            conversationId: message.conversationId,
          },
        });

        if (connections.has(message.conversationId)) {
          const conversationConnections = connections.get(message.conversationId);
          conversationConnections.forEach((recipientWs: any, userId: string) => {
            if (userId !== ws.data.user.id) {
              recipientWs.send(
                JSON.stringify({
                  from: userId,
                  type: "private_message",
                  content: message.content,
                })
              );
            }
          });
        }
        break;

      default:
        ws.send(JSON.stringify({ status: "Error", error: "Unknown message type" }));
    }
  } catch (error) {
    console.error("Error handling message:", error);
    ws.send(JSON.stringify({ status: "Error", error: "Failed to send message" }));
  }
};

export const handleClose = (ws: any) => {};
