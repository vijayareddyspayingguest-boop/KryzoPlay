import BracketMatch from '../BracketMatch';

export default function BracketMatchExample() {
  return (
    <div className="flex gap-4 flex-wrap">
      <BracketMatch
        matchId="m1"
        team1={{ name: "Phantom Strikers", score: 13 }}
        team2={{ name: "Shadow Legends", score: 8 }}
        winner={1}
        round={1}
        position={1}
      />
      <BracketMatch
        matchId="m2"
        team1={{ name: "Radiant Warriors" }}
        team2={{ name: "Viper Squad" }}
        round={2}
        position={1}
      />
      <BracketMatch
        matchId="m3"
        round={3}
        position={1}
      />
    </div>
  );
}
