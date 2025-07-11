
import React from 'react';
import { Button } from '@/components/ui/button';

const LoginButton = () => {
  const handleLogin = () => {
    console.log('Login button clicked');
    // TODO: Implement Internet Identity login
  };

  return (
    <Button 
      onClick={handleLogin}
      className="cyber-glow"
    >
      Connect with Internet Identity
    </Button>
  );
};

export default LoginButton;
