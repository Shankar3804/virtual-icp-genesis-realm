
import React, { useEffect } from 'react';
import { useICP } from '../hooks/useICP';
import LoginButton from '../components/LoginButton';
import AvatarCreator from '../components/AvatarCreator';
import TicketMinter from '../components/TicketMinter';
import VRWorldCreator from '../components/VRWorldCreator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VRDashboard = () => {
  const { isAuthenticated, avatar, loadAllVRWorlds, allVRWorlds } = useICP();

  useEffect(() => {
    if (isAuthenticated) {
      loadAllVRWorlds();
    }
  }, [isAuthenticated, loadAllVRWorlds]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ICP VR Genesis
          </h1>
          <p className="text-muted-foreground">
            Experience the future of virtual reality on the Internet Computer
          </p>
          <LoginButton />
        </header>

        {isAuthenticated ? (
          <Tabs defaultValue="avatar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 holographic">
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="worlds">VR Worlds</TabsTrigger>
            </TabsList>

            <TabsContent value="avatar" className="space-y-6">
              <Card className="holographic">
                <CardHeader>
                  <CardTitle>Create Your Avatar</CardTitle>
                  <CardDescription>
                    Customize your virtual identity for the metaverse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AvatarCreator />
                </CardContent>
              </Card>

              {avatar && (
                <Card className="holographic">
                  <CardHeader>
                    <CardTitle>Your Avatar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {avatar.name}</p>
                      <p><strong>Color:</strong> {avatar.color}</p>
                      <p><strong>Accessory:</strong> {avatar.accessory}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6">
              <Card className="holographic">
                <CardHeader>
                  <CardTitle>Mint Event Tickets</CardTitle>
                  <CardDescription>
                    Create NFT tickets for virtual events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TicketMinter />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="worlds" className="space-y-6">
              <Card className="holographic">
                <CardHeader>
                  <CardTitle>Create VR World</CardTitle>
                  <CardDescription>
                    Build your own virtual reality experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VRWorldCreator />
                </CardContent>
              </Card>

              <Card className="holographic">
                <CardHeader>
                  <CardTitle>Available VR Worlds</CardTitle>
                  <CardDescription>
                    Join existing virtual worlds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {allVRWorlds.map((world) => (
                      <Card key={world.id} className="border-primary/20">
                        <CardHeader>
                          <CardTitle className="text-lg">{world.name}</CardTitle>
                          <CardDescription>{world.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Created by: {world.creator}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Participants: {world.participants.length}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="holographic max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Welcome to ICP VR Genesis</CardTitle>
              <CardDescription>
                Connect your Internet Identity to access the VR metaverse
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VRDashboard;
