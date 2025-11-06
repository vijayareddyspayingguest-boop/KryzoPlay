import { Card } from "@/components/ui/card";

interface BracketMatchProps {
  matchId: string;
  team1?: { name: string; score?: number };
  team2?: { name: string; score?: number };
  winner?: 1 | 2;
  round: number;
  position: number;
}

export default function BracketMatch({
  matchId,
  team1,
  team2,
  winner,
  round,
  position
}: BracketMatchProps) {
  const isComplete = winner !== undefined;
  
  return (
    <Card 
      className="p-4 min-w-[200px]" 
      data-testid={`match-${matchId}`}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
        {round === 1 ? "Round 1" : round === 2 ? "Semi-Finals" : "Finals"}
      </p>
      <div className="space-y-2">
        <div 
          className={`flex items-center justify-between p-2 rounded ${
            team1 && winner === 1 
              ? "bg-primary/20 border border-primary" 
              : "bg-muted/50"
          }`}
          data-testid={`team1-${matchId}`}
        >
          <span className="text-sm font-medium">
            {team1 ? team1.name : "TBD"}
          </span>
          {isComplete && team1?.score !== undefined && (
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              {team1.score}
            </span>
          )}
        </div>
        <div 
          className={`flex items-center justify-between p-2 rounded ${
            team2 && winner === 2 
              ? "bg-primary/20 border border-primary" 
              : "bg-muted/50"
          }`}
          data-testid={`team2-${matchId}`}
        >
          <span className="text-sm font-medium">
            {team2 ? team2.name : "TBD"}
          </span>
          {isComplete && team2?.score !== undefined && (
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              {team2.score}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
