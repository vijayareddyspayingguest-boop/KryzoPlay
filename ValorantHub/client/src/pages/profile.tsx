import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/StatCard";
import TournamentCard from "@/components/TournamentCard";
import TeamCard from "@/components/TeamCard";
import { Trophy, Target, Settings, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import type { Team, Tournament, TournamentRegistration, TeamMember } from "@shared/schema";

type TeamWithMembers = Team & {
  members: (TeamMember & { username: string })[];
  userRole: "captain" | "member";
};

export default function Profile() {
  const [, setLocation] = useLocation();
  const currentUserId = "user-1";

  const { data: registrations = [] } = useQuery<TournamentRegistration[]>({
    queryKey: ["/api/users", currentUserId, "registrations"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/registrations`);
      if (!response.ok) throw new Error("Failed to fetch registrations");
      return response.json();
    },
  });

  const { data: allTournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const registeredTournamentIds = new Set(registrations.map(r => r.tournamentId));
  const activeTournaments = allTournaments.filter(
    t => registeredTournamentIds.has(t.id) && (t.status === "live" || t.status === "upcoming")
  );
  const completedTournaments = allTournaments.filter(
    t => registeredTournamentIds.has(t.id) && t.status === "completed"
  );

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams", currentUserId],
    queryFn: async () => {
      const response = await fetch(`/api/teams?userId=${currentUserId}`);
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    },
  });

  const { data: teamsWithMembers = [] } = useQuery<TeamWithMembers[]>({
    queryKey: ["/api/teams/with-members", currentUserId],
    queryFn: async () => {
      const teamsData = await Promise.all(
        teams.map(async (team) => {
          const membersResponse = await fetch(`/api/teams/${team.id}/members`);
          const members = await membersResponse.json();
          const userMember = members.find((m: any) => m.userId === currentUserId);
          return {
            ...team,
            members,
            userRole: userMember?.role || "member",
          };
        })
      );
      return teamsData;
    },
    enabled: teams.length > 0,
  });

  const tournamentsEntered = registrations.length;
  const tournamentsWon = teams.reduce((sum, team) => sum + team.tournamentsWon, 0);
  const winRate = tournamentsEntered > 0 
    ? Math.round((tournamentsWon / tournamentsEntered) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Avatar className="w-24 h-24" data-testid="avatar-profile">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  P1
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2 flex-wrap">
                  <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    Player123
                  </h1>
                  <span className="px-4 py-1 bg-primary/20 text-primary rounded uppercase text-sm font-semibold tracking-wide">
                    Diamond
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2024</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    label="Tournaments Entered"
                    value={tournamentsEntered}
                    icon={Trophy}
                  />
                  <StatCard
                    label="Tournaments Won"
                    value={tournamentsWon}
                    icon={Trophy}
                  />
                  <StatCard
                    label="Win Rate"
                    value={`${winRate}%`}
                    icon={Target}
                  />
                </div>
              </div>
              
              <Button variant="outline" data-testid="button-settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active" data-testid="tab-active">
              Active Tournaments
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed
            </TabsTrigger>
            <TabsTrigger value="teams" data-testid="tab-teams">
              Teams
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            {activeTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTournaments.map((tournament) => (
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No active tournaments</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {completedTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTournaments.map((tournament) => (
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No completed tournaments</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-6">
            {teamsWithMembers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamsWithMembers.map((team) => (
                  <TeamCard
                    key={team.id}
                    id={team.id}
                    name={team.name}
                    tag={team.tag}
                    members={team.members as any}
                    tournamentsEntered={team.tournamentsEntered}
                    winRate={Math.round((team.tournamentsWon / Math.max(team.tournamentsEntered, 1)) * 100)}
                    userRole={team.userRole}
                    onManage={team.userRole === "captain" ? () => console.log("Manage team") : undefined}
                    onLeave={() => console.log("Leave team")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No teams joined</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
