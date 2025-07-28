import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

export type Account = {
  id: string;
  email: string;
  subscription_type: number;
  upro_gold: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string;
  account_id: string;
  gender: string;
  age_group: string;
  weight: number;
  height: number;
  upro_gold: number;
  dominant_foot: string;
  playing_position: string;
  experience_total: number;
  created_at: string;
  subscription_type: number;
  profile_picture: string | null;
};

type AuthContextType = {
  switchProfile: (profileId: string) => void;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  account: Account | null;
  profiles: Profile[];
  currentProfile: Profile | null;
  setCurrentProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  refreshProfiles: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    try {
      const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      };
      getSession();

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
        }
      );

      return () => {
        listener?.subscription?.unsubscribe();
      };
    } catch (error) {
      console.error("Error in AuthProvider useEffect:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  }, []);

  const fetchAccount = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (error) {
      // Handle case where account doesn't exist (database was cleaned)
      if (error.code === "PGRST116") {
        console.log("Account not found for authenticated user. Signing out...");
        // Clear local state and sign out from Supabase
        setSession(null);
        setUser(null);
        setAccount(null);
        setProfiles([]);
        setCurrentProfile(null);
        await supabase.auth.signOut();
        return;
      }

      console.error("Error fetching account:", error.message);
      return;
    }

    setAccount(data);
  };
  useEffect(() => {
    if (user) {
      try {
        fetchAccount();
      } catch (error) {
        console.error("Error fetching account:", error);
        Alert.alert("Error", "Failed to fetch account information.");
      }
    } else {
      // Clear all data when user is null
      setAccount(null);
      setProfiles([]);
      setCurrentProfile(null);
    }
  }, [user]);
  useEffect(() => {
    if (account) {
      try {
        fetchProfiles();
      } catch (error) {
        console.error("Error fetching profiles:", error);
        Alert.alert("Error", "Failed to fetch profiles.");
      }
    } else {
      // Clear profiles when account is null
      setProfiles([]);
      setCurrentProfile(null);
    }
  }, [account]);
  const fetchProfiles = async () => {
    if (account) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("account_id", account.id);

      if (error) {
        console.error("Error fetching profiles:", error.message);
        return;
      }

      const profiles = data ?? [];
      setProfiles(profiles);

      // Only switch to first profile if we have profiles and no current profile is set
      if (profiles.length > 0 && !currentProfile) {
        const firstProfile = profiles[0];
        setCurrentProfile(firstProfile);
      } else if (profiles.length === 0) {
        console.log("No profiles found for account");
        setCurrentProfile(null);
      }
    }
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p) => String(p.id) === profileId);
    if (profile) {
      setCurrentProfile(profile);
    } else {
      console.warn(
        `Profile with ID ${profileId} not found in available profiles:`,
        profiles.map((p) => p.id)
      );
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      console.error("Supabase error:", error.message);
      Alert.alert("Something went wrong", error.message);
      return;
    }

    // Explicitly sign out to prevent automatic login after signup
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase error:", error.message);
      Alert.alert("Something went wrong", error.message);
      return;
    }

    setSession(data.session ?? null);
    setUser(data.user ?? null);
  };

  const signOut = async () => {
    // Prevent multiple simultaneous signout attempts
    if (isSigningOut) {
      console.log("Sign out already in progress");
      return;
    }

    try {
      setIsSigningOut(true);

      // Always clear local state first
      setSession(null);
      setUser(null);
      setAccount(null);
      setProfiles([]);
      setCurrentProfile(null);

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        // Log the error but don't throw if it's just a missing session
        if (
          error.message?.includes("session") ||
          error.message?.includes("not authenticated")
        ) {
          console.log("No active session to sign out from:", error.message);
          // This is expected when there's no session, so we just log and continue
          return;
        }

        // For other errors, throw them to be handled by the caller
        console.error("Supabase signOut error:", error.message);
        throw new Error(error.message);
      }
    } catch (error: any) {
      // Re-throw errors that aren't session-related
      if (
        !error.message?.includes("session") &&
        !error.message?.includes("not authenticated")
      ) {
        throw error;
      }
      console.log(
        "Session-related error during signout (safe to ignore):",
        error.message
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Supabase error:", error.message);
      Alert.alert("Something went wrong", error.message);
      return;
    }
  };

  const refreshProfiles = async () => {
    if (account) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("account_id", account.id);

      if (error) {
        console.error("Error refreshing profiles:", error.message);
        return;
      }

      setProfiles(data ?? []);
      // Only auto-select first profile if no current profile is selected
      if (data?.[0] && !currentProfile) {
        switchProfile(String(data[0].id));
      }
    }
  };

  const value: AuthContextType = {
    switchProfile,
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    account,
    profiles,
    currentProfile,
    setCurrentProfile,
    refreshProfiles,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useCurrentProfile = () => {
  const { currentProfile } = useAuth();
  return currentProfile;
};
