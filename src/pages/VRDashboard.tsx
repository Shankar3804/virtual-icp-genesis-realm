import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoginButton from '../components/LoginButton';
import AvatarCreator from '../components/AvatarCreator';
import TicketMinter from '../components/TicketMinter';
import VRWorldCreator from '../components/VRWorldCreator';
import VRScene from '../components/VRScene';
import { useICP } from '../hooks/useICP';

const VRDashboard = () => {
  const [userCount] = useState(Math.floor(Math.random() * 50) + 10);
  const [showVR, setShowVR] = useState(false);
  const [showWorldSelection, setShowWorldSelection] = useState(false);
  const { isAuthenticated, loading, allVRWorlds, joinVRWorld } = useICP();

  const handleVRInteraction = () => {
    console.log('VR Interaction detected!');
  };

  const handleCreateVR = () => {
    console.log('Creating new VR world...');
    setShowVR(true);
    setShowWorldSelection(false);
  };

  const handleEnterVR = () => {
    console.log('Showing existing VR worlds...');
    setShowWorldSelection(true);
    setShowVR(false);
  };

  const handleJoinWorld = async (worldId: string) => {
    const success = await joinVRWorld(worldId);
    if (success) {
      setShowVR(true);
      setShowWorldSelection(false);
    }
  };

  const handleExitVR = () => {
    setShowVR(false);
    setShowWorldSelection(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Initializing ICP connection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
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
        <div className="text-center space-y-8 py-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent neon-text">
              Access Denied
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please login to access the VR Dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            {(showVR || showWorldSelection) && (
              <Button onClick={handleExitVR} variant="outline" className="holographic">
                Back to Dashboard
              </Button>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showVR ? (
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
        ) : showWorldSelection ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent neon-text mb-4">
                Select VR World to Join
              </h2>
            </div>
            
            {allVRWorlds.length > 0 ? (
              <Card className="holographic max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-secondary neon-text">Available VR Worlds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {allVRWorlds.map((world) => (
                      <div 
                        key={world.id}
                        className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-3 flex-1">
                            <h4 className="text-xl font-semibold text-foreground">{world.name}</h4>
                            <p className="text-sm text-muted-foreground">{world.description}</p>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span>Participants: {world.participants.length}</span>
                              <span>Created: {new Date(Number(world.createdAt)).toLocaleDateString()}</span>
                              <span className={`${world.isActive ? 'text-primary' : 'text-destructive'}`}>
                                {world.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleJoinWorld(world.id)}
                            className="ml-6 bg-secondary hover:bg-secondary/80"
                          >
                            Join World
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="holographic max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No VR worlds available yet.</p>
                  <p className="text-muted-foreground text-sm mt-2">Create the first one to get started!</p>
                  <Button 
                    onClick={handleCreateVR}
                    className="mt-4 cyber-glow bg-primary hover:bg-primary/80"
                  >
                    Create VR World
                  </Button>
                </CardContent>
              </Card>
            )}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

              <Card className="holographic">
                <CardHeader>
                  <CardTitle className="text-primary neon-text">VR Worlds</CardTitle>
                </CardHeader>
                <CardContent>
                  <VRWorldCreator />
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
                      <li>• Share with friends</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Join VR World:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Browse available worlds</li>
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

export default VRDashboard;
