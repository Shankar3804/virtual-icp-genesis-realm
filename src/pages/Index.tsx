
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginButton from '../components/LoginButton';
import AvatarCreator from '../components/AvatarCreator';
import TicketMinter from '../components/TicketMinter';
import VRScene from '../components/VRScene';
import { useICP } from '../hooks/useICP';

const Index = () => {
  const [userCount] = useState(Math.floor(Math.random() * 50) + 10);
  const { isAuthenticated, loading } = useICP();

  const handleVRInteraction = () => {
    console.log('VR Interaction detected!');
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
          <LoginButton />
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* VR Scene */}
            <div className="lg:col-span-2">
              <Card className="holographic h-[600px]">
                <CardHeader>
                  <CardTitle className="text-primary neon-text flex items-center justify-between">
                    Virtual Reality Experience
                    <span className="text-sm font-normal text-muted-foreground">
                      {userCount} users online
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[520px] p-0">
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

            {/* Control Panel */}
            <div className="space-y-6">
              <Tabs defaultValue="avatar" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger value="avatar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Avatar
                  </TabsTrigger>
                  <TabsTrigger value="tickets" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                    Tickets
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="avatar" className="mt-6">
                  <AvatarCreator />
                </TabsContent>
                
                <TabsContent value="tickets" className="mt-6">
                  <TicketMinter />
                </TabsContent>
              </Tabs>

              {/* Instructions */}
              <Card className="holographic">
                <CardHeader>
                  <CardTitle className="text-primary neon-text text-sm">VR Controls</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>• Click and drag to rotate view</p>
                  <p>• Scroll to zoom in/out</p>
                  <p>• Click objects to interact</p>
                  <p>• Central sphere: Quick actions</p>
                </CardContent>
              </Card>
            </div>
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
