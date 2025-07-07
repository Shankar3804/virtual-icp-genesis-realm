
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useICP } from '../hooks/useICP';

const LoginButton: React.FC = () => {
  const { isAuthenticated, loading, login, logout, principal } = useICP();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login();
    if (success) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <Button disabled className="cyber-glow holographic">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
        Connecting...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button 
        onClick={logout}
        variant="outline"
        className="holographic hover:bg-destructive/20"
      >
        Logout ({principal?.toString().slice(0, 8)}...)
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleLogin}
      className="cyber-glow pulse-neon bg-primary hover:bg-primary/80 text-primary-foreground font-semibold"
    >
      Connect with Internet Identity
    </Button>
  );
};

export default LoginButton;
