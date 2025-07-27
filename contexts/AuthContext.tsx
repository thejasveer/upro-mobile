import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
  upro_gold: number;
  height: number;
  dominant_foot: string;
  playing_position: string;
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
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
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching account:", error);
        return;
      }
      console.log("Fetched account:", data);
      setAccount(data);
    };

    fetchAccount();
  }, [user]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!account) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("account_id", account.id);
      console.log("Fetching profiles for account:---------------------");
      if (error) {
        console.error("Error fetching profiles:", error);
        return;
      }

      setProfiles(data || []);
      //   setCurrentProfile(data?.[0] || null); // Set the first profile as current by default
      switchProfile(data?.[0]?.id || ""); // Ensure current profile is set if available
    };

    fetchProfiles();
  }, [account]);

  useEffect(() => {
    if (profiles.length > 0) {
      setCurrentProfile(profiles[0]); // Set the first profile as current by default
    }
  }, [profiles]);
  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
      console.log("Switched to profile:", profile);
    } else {
      console.warn(`Profile with ID ${profileId} not found`);
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
        data: { first_name: firstName, last_name: lastName },
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const useCurrentProfile = () => {
  const { currentProfile } = useAuth();
  return currentProfile;
};
