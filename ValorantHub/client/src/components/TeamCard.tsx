import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, TrendingUp } from "lucide-react";

interface TeamMember {
  id: string;
  username: string;
  role: "captain" | "member";
}

interface TeamCardProps {
  id: string;
  name: string;
  tag: string;
  members: TeamMember[];
  tournamentsEntered: number;
  winRate: number;
  userRole?: "captain" | "member";
  onManage?: () => void;
  onLeave?: () => void;
}

export default function TeamCard({
  id,
  name,
  tag,
  members,
  tournamentsEntered,
  winRate,
  userRole,
  onManage,
  onLeave
}: TeamCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-team-${id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {name}
            </h3>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">{tag}</p>
          </div>
          {userRole && (
            <Badge variant={userRole === "captain" ? "default" : "secondary"} data-testid={`badge-role-${userRole}`}>
              {userRole === "captain" ? "Captain" : "Member"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Members
          </p>
          <div className="flex gap-2 flex-wrap">
            {members.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="w-10 h-10" data-testid={`avatar-member-${member.id}`}>
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {member.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 5 && (
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  +{members.length - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tournaments</p>
              <p className="text-lg font-semibold">{tournamentsEntered}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Win Rate</p>
              <p className="text-lg font-semibold">{winRate}%</p>
            </div>
          </div>
        </div>
      </CardContent>
      {(onManage || onLeave) && (
        <CardFooter className="flex gap-3 flex-wrap pt-4">
          {onManage && (
            <Button onClick={onManage} variant="default" data-testid="button-manage-team">
              Manage Team
            </Button>
          )}
          {onLeave && (
            <Button onClick={onLeave} variant="outline" data-testid="button-leave-team">
              Leave Team
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
