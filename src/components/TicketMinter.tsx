
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useICP } from '../hooks/useICP';
import { useToast } from '@/hooks/use-toast';

const TicketMinter = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { mintTicket } = useICP();
  const { toast } = useToast();

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate || !ticketType) return;

    setLoading(true);
    try {
      const eventDateBigInt = BigInt(new Date(eventDate).getTime());
      await mintTicket(eventName, eventDateBigInt, ticketType);
      
      toast({
        title: "Ticket Minted!",
        description: `Successfully minted ${ticketType} ticket for ${eventName}`,
      });
      
      setEventName('');
      setEventDate('');
      setTicketType('');
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMint} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventName">Event Name</Label>
        <Input
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter event name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eventDate">Event Date</Label>
        <Input
          id="eventDate"
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ticketType">Ticket Type</Label>
        <Input
          id="ticketType"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          placeholder="VIP, General, Early Bird, etc."
          required
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Minting...' : 'Mint Ticket NFT'}
      </Button>
    </form>
  );
};

export default TicketMinter;
