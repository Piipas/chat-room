import { createDirectConversation, getConversationWithMessages, getUserDirectConversations } from "../controllers/conversation-controllers";

export default (app: any) => {
  app.get("/api/conversations", getUserDirectConversations, { auth: true });
  app.post("/api/conversations/direct", createDirectConversation, { auth: true });
  app.get("/api/conversations/:id", getConversationWithMessages, { auth: true });
};
