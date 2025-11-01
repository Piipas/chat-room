import { prisma } from "@bibas/prisma";

export const createDirectConversation = async ({ user, body }: any) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        type: "DIRECT",
        Users: {
          connect: [{ id: user.id }, { id: body.recipientId }],
        },
      },
    });
    return conversation;
  } catch (error) {
    console.error("Error creating direct conversation:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export const getUserDirectConversations = async ({ user }: any) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        Users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        Users: { where: { id: { not: user.id } }, select: { id: true, name: true, email: true, image: true } },
      },
    });
    return conversations;
  } catch (error) {
    console.error("Error fetching user conversations:", error);
  }
};

export const getConversationWithMessages = async ({ user, params }: any) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        Users: {
          where: { id: { not: user.id } },
          select: { id: true, name: true, email: true },
        },
        Messages: {
          orderBy: { createdAt: "asc" },
          include: {
            Sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return conversation;
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
  }
};
