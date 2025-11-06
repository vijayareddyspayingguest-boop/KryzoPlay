import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "live" | "upcoming" | "completed" | "registered";
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const variants = {
    live: "bg-destructive/90 text-destructive-foreground border-destructive-border",
    upcoming: "bg-chart-4/90 text-white border-chart-4",
    completed: "bg-muted text-muted-foreground border-muted-border",
    registered: "bg-primary/90 text-primary-foreground border-primary-border"
  };

  const labels = {
    live: "LIVE",
    upcoming: "UPCOMING",
    completed: "COMPLETED",
    registered: "REGISTERED"
  };

  return (
    <Badge 
      className={`px-3 py-1 text-xs uppercase tracking-wide ${variants[status]} ${className}`}
      data-testid={`badge-status-${status}`}
    >
      {status === "live" && (
        <span className="inline-block w-2 h-2 mr-2 bg-white rounded-full animate-pulse" />
      )}
      {labels[status]}
    </Badge>
  );
}
