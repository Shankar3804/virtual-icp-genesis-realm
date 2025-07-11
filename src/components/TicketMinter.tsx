
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useICP } from '../hooks/useICP';

const TicketMinter = () => {
  const [eventName, setEventName] = useState('');
  const [ticketType, setTicketType] = useState('VIP');
  const { mintTicket, tickets } = useICP();

  const handleMint = async () => {
    if (eventName.trim()) {
      const eventDate = BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
      await mintTicket(eventName, eventDate, ticketType);
      setEventName('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Event Name</label>
        <Input 
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter event name"
          className="holographic"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Ticket Type</label>
        <select 
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          className="w-full p-2 rounded border holographic bg-background"
        >
          <option value="VIP">VIP</option>
          <option value="General">General</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <Button 
        onClick={handleMint}
        className="w-full cyber-glow"
        disabled={!eventName.trim()}
      >
        Mint Ticket
      </Button>

      {tickets.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            You have {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketMinter;
