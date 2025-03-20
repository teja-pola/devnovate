import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session?.user) {
          const user = data.session.user;

          // Check if user already exists in users table
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single();

          if (!existingUser) {
            // Extract full name from user metadata
            const fullName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split('@')[0] ||
              'User';

            // Create in users table
            const { error: userError } = await supabase.from('users').insert({
              id: user.id,
              full_name: fullName,
            });

            if (userError) {
              console.error('Error creating user record:', userError);
              toast.error('Error setting up your account');
            }

            // Default user type for OAuth users
            const userType = 'candidate';

            // Create in profiles table
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                full_name: fullName,
                user_type: userType,
              });

            if (profileError) {
              console.error('Error creating profile:', profileError);
              toast.error('Error setting up your profile');
            } else {
              toast.success('Account created successfully');
            }
          }

          toast.success('Signed in successfully');
          navigate('/dashboard');
        } else {
          navigate('/auth/login');
        }
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        toast.error(error.message || 'Authentication failed');
        navigate('/auth/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Completing authentication...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
