import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthSession, User } from '../utils/types';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthContextProps {
  session: AuthSession;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession>({
    user: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            setSession({
              user: {
                id: userData.user.id,
                email: userData.user.email || '',
                full_name: userData.user.user_metadata?.full_name,
                avatar_url: userData.user.user_metadata?.avatar_url,
              },
              error: null,
              isLoading: false,
            });
          }
        } else {
          setSession({
            user: null,
            error: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setSession({
          user: null,
          error: error as Error,
          isLoading: false,
        });
      }
    };

    checkUser();

    // Set up auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = session.user;
        setSession({
          user: {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
          },
          error: null,
          isLoading: false,
        });
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setSession({
          user: null,
          error: null,
          isLoading: false,
        });
        navigate('/');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Account created successfully! Please check your email to confirm your account.');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
      setSession({
        ...session,
        error: error as Error,
      });
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe // This controls whether the session is persisted
        }
      });

      if (error) throw error;
      
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      setSession({
        ...session,
        error: error as Error,
      });
    }
  };

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in with GitHub');
      setSession({
        ...session,
        error: error as Error,
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign out');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!session.user) throw new Error('No user logged in');

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          avatar_url: data.avatar_url,
        },
      });

      if (error) throw error;

      setSession({
        ...session,
        user: {
          ...session.user,
          ...data,
        },
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signUp,
        signIn,
        signInWithGithub,
        signOut,
        updateProfile,
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