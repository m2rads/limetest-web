"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();        
        if (sessionError) throw sessionError;
        
        if (session) {
          router.push("/dashboard");
        } else {
          const { data, error: exchangeError } = await supabase.auth.getUser();
          
          if (exchangeError) throw exchangeError;
          
          if (data.user) {
            router.push("/dashboard");
          } else {
            setError("Authentication failed. Please try again.");
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("An error occurred during authentication. Please try again.");
        setIsLoading(false);
      }
    }
    handleCallback();
  }, [router, supabase]);

  if (error) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-gradient-radial-subtle">
        <div className="p-8 text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Authentication Error
          </h1>
          <p className="text-muted-foreground mb-6">
            {error}
          </p>
          <button 
            onClick={() => router.push("/auth/login")}
            className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-radial-subtle">
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Authenticating...
        </h1>
        <p className="text-muted-foreground mb-6">
          Please wait while we redirect you.
        </p>
        
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-foreground/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-lime-500 animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 