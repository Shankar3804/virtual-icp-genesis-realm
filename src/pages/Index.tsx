
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButton from '../components/LoginButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary pulse-neon"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ICP VR Genesis
            </h1>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-8 py-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent neon-text">
              Welcome to the Decentralized Metaverse
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience immersive VR powered by the Internet Computer Protocol. 
              Create avatars, mint tickets, and explore virtual worlds—all secured by blockchain.
            </p>
          </div>
          
          <div className="flex justify-center">
            <LoginButton />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <Card className="holographic">
              <CardHeader>
                <CardTitle className="text-primary">🌐 Decentralized</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fully hosted on Internet Computer with no traditional servers
                </p>
              </CardContent>
            </Card>
            
            <Card className="holographic">
              <CardHeader>
                <CardTitle className="text-primary">🔐 Secure Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Password-less authentication via Internet Identity
                </p>
              </CardContent>
            </Card>
            
            <Card className="holographic">
              <CardHeader>
                <CardTitle className="text-primary">🎟️ Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mint and manage event tickets with blockchain security
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Built on Internet Computer Protocol • Powered by React Three Fiber
            </p>
            <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
              <span>Decentralized Backend</span>
              <span>•</span>
              <span>Internet Identity Auth</span>
              <span>•</span>
              <span>Smart Contract Tickets</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
