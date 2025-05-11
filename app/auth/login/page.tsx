"use client";

import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/utils";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

export default function Page() {
  const supabase = createClient();

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${getSiteUrl()}/auth/callback`, // Using our utility function
      },
    });
    if (error) {
      console.error("GitHub login error:", error.message);
      // Handle error appropriately in UI
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-radial-subtle">
      <div className="w-full max-w-xs p-8 space-y-6 bg-card rounded-xl shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Use your GitHub account to continue
          </p>
        </div>
        <Button
          onClick={handleGitHubLogin}
          className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white"
        >
          <IconBrandGithub size={20} className="mr-2" />
          Continue with GitHub
        </Button>
        {/* You might want to add a loading state or error message display here */}
      </div>
    </div>
  );
}
