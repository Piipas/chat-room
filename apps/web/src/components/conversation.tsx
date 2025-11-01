import type { ConversationWithMessages, SessionUser } from "@/types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { ConversationInput } from "./conversation-input";
import { queryClient } from "@/lib/react-query";

export function Conversation({
  messages,
  currentUser,
  conversationId,
}: {
  messages: ConversationWithMessages["Messages"];
  currentUser?: SessionUser;
  conversationId?: string;
}) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectToWebSocket = useCallback(() => {
    const socket = new WebSocket(`${import.meta.env.API_URL}/ws/${conversationId}`);
    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ type: "join", conversationId }));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      queryClient.invalidateQueries({ queryKey: ["conversationWithMessages", conversationId] });
      console.log("Message received:", data);
    };
    socket.onclose = () => {
      console.log("WebSocket connection closed");
      socket.send(JSON.stringify({ type: "leave", conversationId }));
    };
    setWs(socket);
  }, [conversationId]);

  useEffect(() => {
    connectToWebSocket();
  }, [connectToWebSocket]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-auto">
      <div className="space-y-2 flex-1 overflow-y-auto p-4 overflow-auto min-h-0">
        {messages.length > 0 &&
          messages.map((message) => (
            <div className={cn(message.Sender.id === currentUser?.data.user?.id ? "flex justify-end" : "flex justify-start")} key={message.id}>
              <div
                className={cn(
                  "py-4 px-3 rounded-2xl font-semibold max-w-3/4 w-auto inline-block",
                  message.Sender.id === currentUser?.data.user?.id ? "bg-green-300" : "bg-gray-100"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
      </div>
      <ConversationInput conversationId={conversationId!} ws={ws} />
    </div>
  );
}
