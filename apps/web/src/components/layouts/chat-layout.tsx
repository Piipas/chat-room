import { Outlet } from "react-router";
import { SidebarProvider } from "../shadcn/sidebar";
import { AppSidebar } from "../app-sidebar";

export function ChatLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
