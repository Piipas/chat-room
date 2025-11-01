import { SidebarMenuItem } from "./shadcn/sidebar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ConversationApi } from "@/lib/api/conversations";

export function ConversationsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => await ConversationApi.getConversations(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return data?.length ? (
    <>
      {data.map((conversation) => (
        <SidebarMenuItem key={conversation.id}>
          <a href={`/chat/${conversation.id}`} className={cn("flex gap-3 items-center hover:font-bold", "")}>
            <img
              src={conversation.Users[0]?.image || "/avatars/billie-eilish.webp"}
              alt="User Avatar"
              className="w-9 aspect-square rounded-full border border-input p-0.5"
            />
            <span>{conversation.Users[0]?.name}</span>
          </a>
        </SidebarMenuItem>
      ))}
    </>
  ) : (
    "No Conversations Found"
  );
}
