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
  onClick?: () => void;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  variant,
  onClick,
}: QuickActionCardProps) {
  const isLost = variant === "lost";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-60 w-full flex-col rounded-xl p-7 text-left transition-transform",
        "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2",
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
    </button>
  );
}
