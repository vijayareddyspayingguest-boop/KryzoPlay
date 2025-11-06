import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import BracketMatch from "@/components/BracketMatch";
import { Trophy, Users, Calendar, Target, ArrowLeft } from "lucide-react";
import tournamentBanner from "@assets/generated_images/Valorant_tournament_hero_banner_00fa9dff.png";
import type { Tournament, Match, Team } from "@shared/schema";

export default function TournamentDetail() {
  const [match, params] = useRoute("/tournament/:id");
  const [, setLocation] = useLocation();
  const tournamentId = params?.id || "";

  const { data: tournament, isLoading } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", tournamentId],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${tournamentId}`);
      if (!response.ok) throw new Error("Failed to fetch tournament");
      return response.json();
    },
    enabled: !!tournamentId,
  });

  const { data: matches = [] } = useQuery<Match[]>({
    queryKey: ["/api/tournaments", tournamentId, "matches"],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${tournamentId}/matches`);
      if (!response.ok) throw new Error("Failed to fetch matches");
      return response.json();
    },
    enabled: !!tournamentId,
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  if (isLoading || !tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading tournament...</p>
      </div>
    );
  }

  const prizeDistribution = JSON.parse(tournament.prizeDistribution);

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${tournamentBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <Button
            variant="ghost"
            className="mb-8 w-fit"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
          
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h1 className="text-5xl md:text-6xl font-bold uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              {tournament.name}
            </h1>
            <StatusBadge status={tournament.status as "live" | "upcoming" | "completed" | "registered"} />
          </div>
          
          <div className="flex gap-8 flex-wrap text-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Prize Pool:</span>
              <span className="font-bold">{tournament.prizePool}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Participants:</span>
              <span className="font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Format:</span>
              <span className="font-bold">{tournament.format}</span>
            </div>
          </div>

          {tournament.status === "upcoming" && (
            <div className="mt-6">
              <Button size="lg" data-testid="button-register-hero">
                Register Now
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              About
            </h2>
            <p className="text-muted-foreground mb-6">{tournament.description}</p>
            
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Rules
            </h3>
            <ul className="space-y-2">
              {tournament.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{rule}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{tournament.schedule}</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Prize Distribution
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {prizeDistribution.map((prize: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{prize.place}</span>
                      <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                        {prize.prize}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {matches.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Tournament Bracket
            </h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-8 min-w-max">
                {[1, 2, 3].map((round) => {
                  const roundMatches = matches.filter((m) => m.round === round);
                  if (roundMatches.length === 0) return null;

                  return (
                    <div key={round} className="space-y-4">
                      <h3 className="text-lg font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                        {round === 1 ? "Round 1" : round === 2 ? "Semi-Finals" : "Finals"}
                      </h3>
                      {roundMatches.map((match) => {
                        const team1 = teams.find(t => t.id === match.team1Id);
                        const team2 = teams.find(t => t.id === match.team2Id);

                        return (
                          <BracketMatch
                            key={match.id}
                            matchId={match.id}
                            team1={team1 ? { 
                              name: team1.name, 
                              score: match.team1Score || undefined 
                            } : undefined}
                            team2={team2 ? { 
                              name: team2.name, 
                              score: match.team2Score || undefined 
                            } : undefined}
                            winner={match.winnerId === match.team1Id ? 1 : match.winnerId === match.team2Id ? 2 : undefined}
                            round={match.round}
                            position={match.position}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
