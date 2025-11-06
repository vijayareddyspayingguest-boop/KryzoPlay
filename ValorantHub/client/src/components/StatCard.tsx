import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export default function StatCard({ label, value, icon: Icon, className = "" }: StatCardProps) {
  return (
    <Card className={`p-6 ${className}`} data-testid="card-stat">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
            {label}
          </p>
          <p className="text-4xl font-bold font-sans" style={{ fontFamily: 'var(--font-display)' }}>
            {value}
          </p>
        </div>
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </Card>
  );
}
