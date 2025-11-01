import { Conversation } from "@/components/conversation";
import { Button } from "@/components/shadcn/button";
import { SidebarTrigger } from "@/components/shadcn/sidebar";
import { ConversationApi } from "@/lib/api/conversations";
import { usersApi } from "@/lib/api/users";
import { useQueries } from "@tanstack/react-query";
import { Ellipsis, Loader2 } from "lucide-react";
import { useParams } from "react-router";

export function Chat() {
  const { id } = useParams();
  const {
    "0": { data: conversationData, isLoading: isLoadingConversation, error: errorConversation },
    "1": { data: currentUserData, isLoading: isLoadingCurrentUser, error: errorCurrentUser },
  } = useQueries({
    queries: [
      {
        queryKey: ["conversationWithMessages", id],
        queryFn: async () => await ConversationApi.getConversationById(id!),
      },
      {
        queryKey: ["currentUser"],
        queryFn: usersApi.getUser,
      },
    ],
  });

  if (errorConversation || errorCurrentUser) return <div>Error: {errorConversation?.message || errorCurrentUser?.message}</div>;

  return !isLoadingConversation && !isLoadingCurrentUser ? (
    <div className="w-full flex flex-col h-full bg-[url('/conversation-wallpaper.webp')] max-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-b-muted w-full bg-background">
        {/* <div className="flex gap-4"> */}
        <SidebarTrigger size={"icon-lg"} className="cursor-pointer" />
        <div className="text-2xl font-bold flex items-center gap-2">
          <span>{conversationData?.Users?.[0].name || "Unknown"}</span>
          {/* <Circle className="fill-gray-500 text-gray-500 w-1 h-1" /> */}
          {/* <span className="text-green-400 text-sm">+6 online</span> */}
          {/* </div> */}
        </div>
        <div className="flex gap-4">
          <Button size={"icon"} variant={"ghost"}>
            <Ellipsis />
          </Button>
        </div>
      </div>
      <Conversation messages={conversationData?.Messages || []} currentUser={currentUserData} conversationId={id} />
    </div>
  ) : (
    <div className="flex items-center justify-center w-full h-screen bg-white/60">
      <Loader2 className="animate-spin" />
    </div>
  );
}
