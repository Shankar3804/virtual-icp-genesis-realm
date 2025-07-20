
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
      <div className="text-center">
        <p className="text-green-400 mb-4">Avatar created successfully!</p>
        <div className="space-y-2">
          <p><strong>Name:</strong> {avatar.name}</p>
          <p><strong>Color:</strong> {avatar.color}</p>
          <p><strong>Accessory:</strong> {avatar.accessory}</p>
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
          placeholder="Enter your avatar name"
          className="holographic"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Color</label>
        <input 
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 rounded border holographic"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Accessory</label>
        <select 
          value={accessory}
          onChange={(e) => setAccessory(e.target.value)}
          className="w-full p-2 rounded border holographic bg-background"
        >
          <option value="none">None</option>
          <option value="hat">Hat</option>
          <option value="glasses">Glasses</option>
          <option value="mask">Mask</option>
        </select>
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
