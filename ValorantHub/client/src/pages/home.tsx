import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import TournamentCard from "@/components/TournamentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || tournament.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRegister = (tournamentId: string) => {
    console.log(`Registering for tournament ${tournamentId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading tournaments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Tournaments
          </h1>
          <p className="text-lg text-muted-foreground">
            Join competitive tournaments and prove your skills
          </p>
        </div>

        <div className="flex gap-4 flex-wrap mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tournaments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              data-testid="button-filter-all"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "live" ? "default" : "outline"}
              onClick={() => setFilterStatus("live")}
              data-testid="button-filter-live"
            >
              Live
            </Button>
            <Button
              variant={filterStatus === "upcoming" ? "default" : "outline"}
              onClick={() => setFilterStatus("upcoming")}
              data-testid="button-filter-upcoming"
            >
              Upcoming
            </Button>
            <Button
              variant={filterStatus === "registered" ? "default" : "outline"}
              onClick={() => setFilterStatus("registered")}
              data-testid="button-filter-registered"
            >
              My Tournaments
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              id={parseInt(tournament.id.split('-')[0]) || 0}
              name={tournament.name}
              status={tournament.status as "live" | "upcoming" | "completed" | "registered"}
              prizePool={tournament.prizePool}
              entryFee={tournament.entryFee}
              participants={tournament.currentParticipants}
              maxParticipants={tournament.maxParticipants}
              format={tournament.format}
              onViewDetails={() => setLocation(`/tournament/${tournament.id}`)}
              onRegister={
                tournament.status === "upcoming" 
                  ? () => handleRegister(tournament.id)
                  : undefined
              }
            />
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No tournaments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
