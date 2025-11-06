import StatCard from '../StatCard';
import { Trophy, Users, Target } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard label="Prize Pool" value="₹15,000" icon={Trophy} />
      <StatCard label="Participants" value="128" icon={Users} />
      <StatCard label="Win Rate" value="67%" icon={Target} />
    </div>
  );
}
