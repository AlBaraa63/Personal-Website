import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const { user, profile, loading, signInWithEmail, signUpWithEmail, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#f4f4f5',
            border: '1px solid #3f3f46',
            fontSize: '13px',
          },
        }}
      />
      {user ? (
        <Dashboard user={user} profile={profile} signOut={signOut} />
      ) : (
        <AuthPage signInWithEmail={signInWithEmail} signUpWithEmail={signUpWithEmail} />
      )}
    </>
  );
}
