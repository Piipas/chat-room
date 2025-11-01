import type { SessionUser } from "@/types";
import { authClient } from "../auth-client";

type UsersApi = {
  getUser: () => Promise<SessionUser>;
};

export const usersApi: UsersApi = {
  getUser: async () => await authClient.getSession(),
};
