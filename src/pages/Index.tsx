
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoginButton from '../components/LoginButton';
import AvatarCreator from '../components/AvatarCreator';
import TicketMinter from '../components/TicketMinter';
import VRScene from '../components/VRScene';
import { useICP } from '../hooks/useICP';

const Index = () => {
  const [userCount] = useState(Math.floor(Math.random() * 50) + 10);
  const [showVR, setShowVR] = useState(false);
  const { isAuthenticated, loading } = useICP();

  const handleVRInteraction = () => {
    console.log('VR Interaction detected!');
  };

  const handleCreateVR = () => {
    console.log('Creating new VR world...');
    setShowVR(true);
  };

  const handleEnterVR = () => {
    console.log('Entering existing VR world...');
    setShowVR(true);
  };

  const handleExitVR = () => {
    setShowVR(false);
  };

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
          <div className="flex items-center gap-4">
            {showVR && isAuthenticated && (
              <Button onClick={handleExitVR} variant="outline" className="holographic">
                Exit VR
              </Button>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Initializing ICP connection...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
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
        ) : showVR ? (
          <div className="h-[80vh]">
            <Card className="holographic h-full">
              <CardHeader>
                <CardTitle className="text-primary neon-text flex items-center justify-between">
                  Virtual Reality Experience
                  <span className="text-sm font-normal text-muted-foreground">
                    {userCount} users online
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)] p-0">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">Loading VR Scene...</p>
                    </div>
                  </div>
                }>
                  <VRScene userCount={userCount} onInteraction={handleVRInteraction} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* VR World Options */}
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent neon-text">
                Welcome to ICP VR Genesis
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create your own VR world or join an existing one to start your metaverse journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Button 
                  onClick={handleCreateVR}
                  className="cyber-glow pulse-neon bg-primary hover:bg-primary/80 text-primary-foreground font-semibold w-full sm:w-auto"
                >
                  🌟 Create New VR World
                </Button>
                <Button 
                  onClick={handleEnterVR}
                  variant="outline"
                  className="holographic hover:bg-secondary/20 w-full sm:w-auto"
                >
                  🚪 Enter Existing VR World
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="holographic">
                <CardHeader>
                  <CardTitle className="text-primary neon-text">Avatar & Identity</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvatarCreator />
                </CardContent>
              </Card>
              
              <Card className="holographic">
                <CardHeader>
                  <CardTitle className="text-secondary neon-text">Event Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketMinter />
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="holographic max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-primary neon-text text-center">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Create VR World:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Generate new virtual environment</li>
                      <li>• Customize world settings</li>
                      <li>• Invite friends to join</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Enter VR World:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Join existing worlds</li>
                      <li>• Interact with other users</li>
                      <li>• Explore shared experiences</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
