import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@workspace/db/auth";

interface AuthState {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, faction?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: "github" | "google" | "discord") => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<typeof auth.$Infer.Session.user | null>(null);
  const [session, setSession] = useState<typeof auth.$Infer.Session.session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const sessionData = await auth.api.getSession({
          headers: new Headers(),
        });
        if (sessionData) {
          setUser(sessionData.user);
          setSession(sessionData.session);
        }
      } catch {
        // No session
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await auth.api.signInEmail({
        body: { email, password },
      });
      // signInEmail returns { user, token, redirect }
      if (result.user) {
        setUser(result.user);
        // Fetch session after sign in
        const sessionData = await auth.api.getSession({ headers: new Headers() });
        if (sessionData) setSession(sessionData.session);
      }
      return {};
    } catch (error: any) {
      return { error: error.message || "Sign in failed" };
    }
  };

  const signUp = async (email: string, password: string, name: string, faction?: string) => {
    try {
      const result = await auth.api.signUpEmail({
        body: { email, password, name, faction: faction || "neutral" },
      });
      if (result.user) {
        setUser(result.user);
        const sessionData = await auth.api.getSession({ headers: new Headers() });
        if (sessionData) setSession(sessionData.session);
      }
      return {};
    } catch (error: any) {
      return { error: error.message || "Sign up failed" };
    }
  };

  const signOut = async () => {
    try {
      await auth.api.signOut({
        headers: new Headers(),
      });
      setUser(null);
      setSession(null);
    } catch {
      // Ignore errors
    }
  };

  const signInWithProvider = async (provider: "github" | "google" | "discord") => {
    const { url } = await auth.api.signInSocial({
      body: { provider, callbackURL: "/auth/callback" },
    });
    if (url) window.location.href = url;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, signInWithProvider }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}