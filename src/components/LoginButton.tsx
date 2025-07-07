
import React from 'react';
import { Button } from '@/components/ui/button';
import { useICP } from '../hooks/useICP';

const LoginButton: React.FC = () => {
  const { isAuthenticated, loading, login, logout, principal } = useICP();

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
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Connected: {principal?.toString().slice(0, 8)}...
        </div>
        <Button 
          onClick={logout}
          variant="outline"
          className="holographic hover:bg-destructive/20"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={login}
      className="cyber-glow pulse-neon bg-primary hover:bg-primary/80 text-primary-foreground font-semibold"
    >
      Connect with Internet Identity
    </Button>
  );
};

export default LoginButton;
