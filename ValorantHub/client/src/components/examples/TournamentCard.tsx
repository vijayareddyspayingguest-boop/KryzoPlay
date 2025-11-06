import TournamentCard from '../TournamentCard';

export default function TournamentCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl">
      <TournamentCard
        id={1}
        name="Valorant Knockout Cup"
        status="live"
        prizePool="₹5,000"
        entryFee={0}
        participants={32}
        maxParticipants={64}
        format="Single Elimination"
        onViewDetails={() => console.log('View details clicked')}
      />
      <TournamentCard
        id={2}
        name="Vanguard Showdown"
        status="upcoming"
        prizePool="₹10,000"
        entryFee={0}
        participants={48}
        maxParticipants={128}
        format="Double Elimination"
        onViewDetails={() => console.log('View details clicked')}
        onRegister={() => console.log('Register clicked')}
      />
      <TournamentCard
        id={3}
        name="Champions Arena"
        status="registered"
        prizePool="₹15,000"
        entryFee={100}
        participants={64}
        maxParticipants={64}
        format="Single Elimination"
        onViewDetails={() => console.log('View details clicked')}
      />
    </div>
  );
}
