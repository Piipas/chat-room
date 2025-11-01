import type { Conversation, ConversationWithMessages } from "@/types";
import { ax } from "../axios";

export const ConversationApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await ax.get("/conversations");
    if (response.status !== 200) {
      throw new Error("Failed to fetch conversations");
    }
    return response.data;
  },
  getConversationById: async (id: string): Promise<ConversationWithMessages> => {
    const response = await ax.get(`/conversations/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch conversation");
    }
    return response.data;
  },
};
