
import React from 'react';
import { Button } from '@/components/ui/button';
import { useICP } from '../hooks/useICP';

const LoginButton = () => {
  const { isAuthenticated, login, logout, loading } = useICP();

  if (loading) {
    return (
      <Button disabled className="holographic">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={isAuthenticated ? logout : login}
      className={isAuthenticated ? "bg-destructive hover:bg-destructive/80" : "cyber-glow bg-primary hover:bg-primary/80"}
    >
      {isAuthenticated ? "Logout" : "Login with Internet Identity"}
    </Button>
  );
};

export default LoginButton;
