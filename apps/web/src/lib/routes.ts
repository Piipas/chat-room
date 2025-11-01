import { createBrowserRouter, type RouteObject } from "react-router";
import { ChatLayout } from "../components/layouts/chat-layout";
import { Chat } from "../pages/Chat";
import { Home } from "@/pages/Home";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/chat",
    Component: ChatLayout,
    children: [
      {
        path: "",
      },
      {
        path: ":id",
        Component: Chat,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
