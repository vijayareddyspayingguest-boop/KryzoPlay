import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Users, Trophy, IndianRupee } from "lucide-react";

interface TournamentCardProps {
  id: number;
  name: string;
  status: "live" | "upcoming" | "completed" | "registered";
  prizePool: string;
  entryFee: number;
  participants: number;
  maxParticipants: number;
  format: string;
  onViewDetails: () => void;
  onRegister?: () => void;
}

export default function TournamentCard({
  id,
  name,
  status,
  prizePool,
  entryFee,
  participants,
  maxParticipants,
  format,
  onViewDetails,
  onRegister
}: TournamentCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-tournament-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          {name}
        </h3>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Prize Pool</p>
              <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {prizePool}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Entry Fee</p>
              <p className="text-lg font-semibold">
                {entryFee === 0 ? "Free" : `₹${entryFee}`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Participants</p>
            <p className="text-sm">
              {participants} / {maxParticipants}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Format</p>
          <p className="text-sm">{format}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 flex-wrap pt-4">
        <Button onClick={onViewDetails} variant="outline" data-testid="button-view-details">
          View Details
        </Button>
        {status === "upcoming" && onRegister && (
          <Button onClick={onRegister} variant="default" data-testid="button-register">
            Register Now
          </Button>
        )}
        {status === "registered" && (
          <Button variant="secondary" disabled data-testid="button-registered">
            Registered
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
