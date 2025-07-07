
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useICP } from '../hooks/useICP';

const AvatarCreator: React.FC = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#00ffff');
  const [accessory, setAccessory] = useState('none');
  const [creating, setCreating] = useState(false);
  
  const { createAvatar, avatar } = useICP();

  const handleCreateAvatar = async () => {
    if (!name.trim()) return;
    
    setCreating(true);
    await createAvatar(name, color, accessory);
    setCreating(false);
  };

  if (avatar) {
    return (
      <Card className="holographic">
        <CardHeader>
          <CardTitle className="text-primary neon-text">Your Avatar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-full border-2 border-primary pulse-neon"
              style={{ backgroundColor: avatar.color }}
            />
            <div>
              <h3 className="font-semibold text-foreground">{avatar.name}</h3>
              <p className="text-sm text-muted-foreground">
                Accessory: {avatar.accessory}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="holographic">
      <CardHeader>
        <CardTitle className="text-primary neon-text">Create Your Avatar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="avatar-name">Avatar Name</Label>
          <Input
            id="avatar-name"
            placeholder="Enter your avatar name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border-border"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="avatar-color">Avatar Color</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              id="avatar-color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">{color}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="avatar-accessory">Accessory</Label>
          <Select value={accessory} onValueChange={setAccessory}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="hat">VR Headset</SelectItem>
              <SelectItem value="glasses">Cyber Glasses</SelectItem>
              <SelectItem value="mask">Neon Mask</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleCreateAvatar}
          disabled={!name.trim() || creating}
          className="w-full cyber-glow bg-primary hover:bg-primary/80"
        >
          {creating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Creating Avatar...
            </>
          ) : (
            'Create Avatar'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvatarCreator;
