import { Smile } from "lucide-react";
import { Button } from "./shadcn/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./shadcn/input-group";
import { useState } from "react";
import { queryClient } from "@/lib/react-query";
import type { SessionUser } from "@/types";

export function ConversationInput({ conversationId, ws }: { conversationId: string; ws: WebSocket | null }) {
  const [message, setMessage] = useState("");
  const currentUser = queryClient.getQueryData(["currentUser"]) as { data: SessionUser } | undefined;

  const sendMessage = (message: string) => {
    const adjustedMessage = message.trim();
    if (ws && adjustedMessage) {
      ws.send(JSON.stringify({ type: "private_message", content: adjustedMessage, conversationId, from: currentUser?.data?.user.id }));
      queryClient.invalidateQueries({ queryKey: ["conversationWithMessages", conversationId] });
      setMessage("");
    }
  };

  return (
    <div className="flex gap-2 bg-background/80 p-4">
      <img src="/avatars/billie-eilish.webp" alt="User Avatar" className="w-10 aspect-square rounded-full border border-input p-0.5" />
      <InputGroup>
        <InputGroupInput placeholder="Type a message..." onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} value={message} />
        <InputGroupAddon align={"inline-end"}>
          <InputGroupButton>
            <Smile />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <Button className="bg-green-400 hover:bg-green-400/90 cursor-pointer" onClick={() => sendMessage(message)}>
        Send
      </Button>
    </div>
  );
}
