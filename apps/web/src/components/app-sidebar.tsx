import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu } from "./shadcn/sidebar";
import { ConversationsList } from "./conversations-list";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="text-2xl text-gray-500 font-semibold">Bibas Chat</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Direct Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ConversationsList />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
