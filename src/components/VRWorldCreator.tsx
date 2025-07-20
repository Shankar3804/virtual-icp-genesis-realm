
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const VRWorldCreator = () => {
  const [worldName, setWorldName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worldName || !description) return;

    setLoading(true);
    try {
      // Simulate world creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "VR World Created!",
        description: `Successfully created "${worldName}" virtual world`,
      });
      
      setWorldName('');
      setDescription('');
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create VR world. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="worldName">World Name</Label>
        <Input
          id="worldName"
          value={worldName}
          onChange={(e) => setWorldName(e.target.value)}
          placeholder="Enter world name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your virtual world..."
          required
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating World...' : 'Create VR World'}
      </Button>
    </form>
  );
};

export default VRWorldCreator;
