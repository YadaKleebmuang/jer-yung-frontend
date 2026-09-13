import {
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QuickActionVariant = "lost" | "found";

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: QuickActionVariant;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  variant,
}: QuickActionCardProps) {
  const isLost = variant === "lost";

  return (
    <div
      className={cn(
        "flex min-h-60 flex-col rounded-xl p-7",
        isLost
          ? "bg-brand-purple text-white"
          : "bg-brand-yellow text-foreground",
      )}
    >
      <Icon
        className="size-9"
        aria-hidden="true"
      />

      <h2 className="mt-5 text-2xl font-bold">
        {title}
      </h2>

      <p
        className={cn(
          "mt-2 max-w-56 text-sm leading-6",
          isLost
            ? "text-white/80"
            : "text-foreground/70",
        )}
      >
        {description}
      </p>

      <span
        className={cn(
          "mt-auto ml-auto inline-flex size-10 items-center justify-center rounded-full",
          isLost
            ? "bg-white/85 text-brand-purple"
            : "bg-white/80 text-foreground",
        )}
      >
        <ArrowRight
          className="size-5"
          aria-hidden="true"
        />
      </span>
    </div>
  );
}
