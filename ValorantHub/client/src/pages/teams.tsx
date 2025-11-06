import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import TeamCard from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Team, TeamMember } from "@shared/schema";

type TeamWithMembers = Team & {
  members: (TeamMember & { username: string })[];
  userRole: "captain" | "member";
};

export default function Teams() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamTag, setNewTeamTag] = useState("");
  const { toast } = useToast();

  const currentUserId = "user-1";

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

  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; tag: string; captainId: string }) => {
      return apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setNewTeamName("");
      setNewTeamTag("");
      setIsDialogOpen(false);
      toast({
        title: "Team created",
        description: "Your team has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      return apiRequest("DELETE", `/api/teams/${teamId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Left team",
        description: "You have left the team successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to leave team",
        variant: "destructive",
      });
    },
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate({
      name: newTeamName,
      tag: newTeamTag,
      captainId: currentUserId,
    });
  };

  const handleManageTeam = (teamId: string) => {
    console.log("Managing team:", teamId);
  };

  const handleLeaveTeam = (teamId: string) => {
    deleteTeamMutation.mutate(teamId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              My Teams
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your teams and compete together
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" data-testid="button-create-team">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-create-team">
              <DialogHeader>
                <DialogTitle className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                  Create New Team
                </DialogTitle>
                <DialogDescription>
                  Create a team and invite your friends to compete together
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                    data-testid="input-team-name"
                  />
                </div>
                <div>
                  <Label htmlFor="team-tag">Team Tag</Label>
                  <Input
                    id="team-tag"
                    placeholder="e.g., PHTM"
                    value={newTeamTag}
                    onChange={(e) => setNewTeamTag(e.target.value.toUpperCase())}
                    maxLength={6}
                    required
                    data-testid="input-team-tag"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createTeamMutation.isPending}
                  data-testid="button-submit-team"
                >
                  {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

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
                onManage={team.userRole === "captain" ? () => handleManageTeam(team.id) : undefined}
                onLeave={() => handleLeaveTeam(team.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-6">You haven't joined any teams yet</p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-team">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Team
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
