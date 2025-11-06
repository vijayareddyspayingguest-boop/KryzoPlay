import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-3 flex-wrap">
      <StatusBadge status="live" />
      <StatusBadge status="upcoming" />
      <StatusBadge status="completed" />
      <StatusBadge status="registered" />
    </div>
  );
}
