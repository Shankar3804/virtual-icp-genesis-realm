
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useICP } from '../hooks/useICP';
import { Ticket } from '../types/icp';

const TicketMinter: React.FC = () => {
  const [eventName, setEventName] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [minting, setMinting] = useState(false);
  
  const { mintTicket, tickets } = useICP();

  const handleMintTicket = async () => {
    if (!eventName.trim() || !ticketType) return;
    
    setMinting(true);
    const eventDate = BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    
    await mintTicket(eventName, eventDate, ticketType);
    setMinting(false);
    
    // Clear form
    setEventName('');
    setTicketType('');
  };

  return (
    <div className="space-y-6">
      <Card className="holographic">
        <CardHeader>
          <CardTitle className="text-primary neon-text">Mint Event Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="bg-input border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ticket-type">Ticket Type</Label>
            <Select value={ticketType} onValueChange={setTicketType}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="general">General Admission</SelectItem>
                <SelectItem value="vip">VIP Access</SelectItem>
                <SelectItem value="premium">Premium Experience</SelectItem>
                <SelectItem value="backstage">Backstage Pass</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleMintTicket}
            disabled={!eventName.trim() || !ticketType || minting}
            className="w-full cyber-glow bg-secondary hover:bg-secondary/80"
          >
            {minting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary-foreground mr-2"></div>
                Minting Ticket...
              </>
            ) : (
              'Mint Ticket'
            )}
          </Button>
        </CardContent>
      </Card>

      {tickets.length > 0 && (
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="text-primary neon-text">Your Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map((ticket: Ticket) => (
                <div 
                  key={ticket.id}
                  className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">{ticket.eventName}</h4>
                      <p className="text-sm text-muted-foreground">{ticket.ticketType}</p>
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(Number(ticket.eventDate)).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${ticket.isUsed ? 'text-destructive' : 'text-primary'}`}>
                        {ticket.isUsed ? 'Used' : 'Valid'}
                      </p>
                    </div>
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

export default TicketMinter;
