import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { supabaseExtended } from '@/integrations/supabase/extendedClient';
import { toast } from 'sonner';

type UserType = 'candidate' | 'recruiter';

type AuthContextType = {
  user: User | null;
  userType: UserType | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    userType: UserType
  ) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  githubSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user type from profiles
        const { data } = await supabaseExtended
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        setUserType((data?.user_type as UserType) || 'candidate');
      } else {
        setUserType(null);
      }

      setLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user type from profiles
        const { data } = await supabaseExtended
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        setUserType((data?.user_type as UserType) || 'candidate');
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserRecords = async (
    userId: string,
    fullName: string,
    userType: UserType = 'candidate'
  ) => {
    try {
      const { error: profileError } = await supabaseExtended
        .from('profiles')
        .upsert({
          id: userId,
          full_name: fullName,
          user_type: userType,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        console.error(
          'Profile error details:',
          profileError.details,
          profileError.hint
        );
        return false;
      }

      console.log('Profile created successfully');

      const { error: userError } = await supabase.from('users').upsert({
        id: userId,
        full_name: fullName,
      });

      if (userError) {
        console.error('Error creating user:', userError);
        console.error(
          'User error details:',
          userError.details,
          userError.hint,
          userError.message
        );

        if (userError.code === '23505') {
          console.log('User already exists, continuing...');
          return true;
        }

        return false;
      }

      console.log('User created successfully');
      return true;
    } catch (error) {
      console.error('Error creating user records:', error);
      return false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    userType: UserType
  ) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const success = await createUserRecords(
          data.user.id,
          fullName,
          userType
        );
        if (!success) {
          toast.error('Account created but profile setup failed');
        }
      }

      toast.success('Signed up successfully! Try SignIn now.');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Error signing in with Google');
      console.error('Google sign in error:', error);
    }
  };

  const githubSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Error signing in with GitHub');
      console.error('GitHub sign in error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        googleSignIn,
        githubSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
