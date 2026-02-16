import { User } from 'lucide-react';

export default function TestimonialCard({
  quote,
  name,
  city,
}: {
  quote: string;
  name: string;
  city: string;
}) {
  return (
    <div className="card min-h-[170px] flex flex-col justify-between text-sm w-[260px]">
      <div className="card-body">
        <p className="text-foreground leading-relaxed line-clamp-3">
          "{quote}"
        </p>

        <div className="flex items-center gap-3 mt-4">
          <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground">{city}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
