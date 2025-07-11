
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useICP } from '../hooks/useICP';

const AvatarCreator = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#00ffff');
  const [accessory, setAccessory] = useState('none');
  const { createAvatar, avatar } = useICP();

  const handleCreate = async () => {
    if (name.trim()) {
      await createAvatar(name, color, accessory);
    }
  };

  if (avatar) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-2 cyber-glow"
            style={{ backgroundColor: avatar.color }}
          />
          <h3 className="font-semibold">{avatar.name}</h3>
          <p className="text-sm text-muted-foreground">Avatar created!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Avatar Name</label>
        <Input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter avatar name"
          className="holographic"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Color</label>
        <div className="flex space-x-2">
          {['#00ffff', '#ff00ff', '#ffff00', '#00ff00'].map((col) => (
            <button
              key={col}
              className={`w-8 h-8 rounded-full border-2 ${color === col ? 'border-white' : 'border-gray-400'}`}
              style={{ backgroundColor: col }}
              onClick={() => setColor(col)}
            />
          ))}
        </div>
      </div>

      <Button 
        onClick={handleCreate}
        className="w-full cyber-glow"
        disabled={!name.trim()}
      >
        Create Avatar
      </Button>
    </div>
  );
};

export default AvatarCreator;
