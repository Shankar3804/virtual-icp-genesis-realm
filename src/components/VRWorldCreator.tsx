
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const VRWorldCreator = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (name.trim() && description.trim()) {
      setIsCreating(true);
      // Simulate world creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('VR World created:', { name, description });
      setName('');
      setDescription('');
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">World Name</label>
        <Input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter world name"
          className="holographic"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your VR world"
          className="holographic"
          rows={3}
        />
      </div>

      <Button 
        onClick={handleCreate}
        className="w-full cyber-glow"
        disabled={!name.trim() || !description.trim() || isCreating}
      >
        {isCreating ? 'Creating...' : 'Create VR World'}
      </Button>
    </div>
  );
};

export default VRWorldCreator;
