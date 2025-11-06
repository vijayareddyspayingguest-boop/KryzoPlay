import TeamCard from '../TeamCard';

export default function TeamCardExample() {
  const mockMembers = [
    { id: "1", username: "Player1", role: "captain" as const },
    { id: "2", username: "Player2", role: "member" as const },
    { id: "3", username: "Player3", role: "member" as const },
    { id: "4", username: "Player4", role: "member" as const },
    { id: "5", username: "Player5", role: "member" as const }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl">
      <TeamCard
        id="team-1"
        name="Phantom Strikers"
        tag="PHTM"
        members={mockMembers}
        tournamentsEntered={12}
        winRate={67}
        userRole="captain"
        onManage={() => console.log('Manage team clicked')}
        onLeave={() => console.log('Leave team clicked')}
      />
      <TeamCard
        id="team-2"
        name="Radiant Warriors"
        tag="RDNT"
        members={mockMembers.slice(0, 3)}
        tournamentsEntered={8}
        winRate={50}
        userRole="member"
        onLeave={() => console.log('Leave team clicked')}
      />
    </div>
  );
}
