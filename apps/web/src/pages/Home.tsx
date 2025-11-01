import { Button } from "@/components/shadcn/button";
import { signIn } from "@/lib/auth-client";
import React from "react";

export function Home() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL: import.meta.env.VITE_BASE_URL + "/chat/your-conversation-id",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Button onClick={handleSignIn} disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </div>
  );
}
