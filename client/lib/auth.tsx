import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  npm: string | null;
  avatar_url: string | null;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<UserProfile, "full_name" | "npm" | "avatar_url">>) => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,npm,avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as UserProfile | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user?.id) {
      setProfile(null);
      return;
    }
    try {
      const p = await fetchProfile(user.id);
      setProfile(p);
    } catch {
      // If profile table isn't ready or RLS blocks, keep UI usable.
      setProfile(null);
    }
  };

  // Load profile whenever user changes.
  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const updateProfile: AuthState["updateProfile"] = async (patch) => {
    if (!user?.id) return null;

    const payload = {
      ...patch,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id)
      .select("id,email,full_name,npm,avatar_url")
      .maybeSingle();

    if (error) throw error;

    const updated = (data ?? null) as UserProfile | null;
    setProfile(updated);
    return updated;
  };

  const value = useMemo<AuthState>(
    () => ({
      session,
      user,
      profile,
      isLoading,
      refreshProfile,
      updateProfile,
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
      },
    }),
    [session, user, profile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
