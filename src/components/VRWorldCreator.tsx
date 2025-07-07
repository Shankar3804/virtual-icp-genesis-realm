
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useICP } from '../hooks/useICP';
import { VRWorld } from '../types/icp';

const VRWorldCreator: React.FC = () => {
  const [worldName, setWorldName] = useState('');
  const [worldDescription, setWorldDescription] = useState('');
  const [creating, setCreating] = useState(false);
  
  const { createVRWorld, vrWorlds, allVRWorlds, joinVRWorld } = useICP();

  const handleCreateWorld = async () => {
    if (!worldName.trim() || !worldDescription.trim()) return;
    
    setCreating(true);
    await createVRWorld(worldName, worldDescription);
    setCreating(false);
    
    // Clear form
    setWorldName('');
    setWorldDescription('');
  };

  const handleJoinWorld = async (worldId: string) => {
    await joinVRWorld(worldId);
  };

  return (
    <div className="space-y-6">
      <Card className="holographic">
        <CardHeader>
          <CardTitle className="text-primary neon-text">Create VR World</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="world-name">World Name</Label>
            <Input
              id="world-name"
              placeholder="Enter world name"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              className="bg-input border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="world-description">Description</Label>
            <Textarea
              id="world-description"
              placeholder="Describe your VR world..."
              value={worldDescription}
              onChange={(e) => setWorldDescription(e.target.value)}
              className="bg-input border-border"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleCreateWorld}
            disabled={!worldName.trim() || !worldDescription.trim() || creating}
            className="w-full cyber-glow bg-primary hover:bg-primary/80"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Creating World...
              </>
            ) : (
              'Create VR World'
            )}
          </Button>
        </CardContent>
      </Card>

      {vrWorlds.length > 0 && (
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="text-primary neon-text">Your VR Worlds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vrWorlds.map((world: VRWorld) => (
                <div 
                  key={world.id}
                  className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{world.name}</h4>
                    <p className="text-sm text-muted-foreground">{world.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Participants: {world.participants.length}</span>
                      <span className={`${world.isActive ? 'text-primary' : 'text-destructive'}`}>
                        {world.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {allVRWorlds.length > 0 && (
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="text-secondary neon-text">Available VR Worlds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allVRWorlds.map((world: VRWorld) => (
                <div 
                  key={world.id}
                  className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-foreground">{world.name}</h4>
                      <p className="text-sm text-muted-foreground">{world.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Participants: {world.participants.length}</span>
                        <span>Created: {new Date(Number(world.createdAt)).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinWorld(world.id)}
                      size="sm"
                      className="ml-4 bg-secondary hover:bg-secondary/80"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VRWorldCreator;
