import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
  header?: ReactNode;
  className?: string;
}

export function AppShell({
  sidebar,
  children,
  header,
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background lg:grid lg:grid-cols-[280px_minmax(0,1fr)]",
        className,
      )}
    >
      <aside className="hidden min-h-screen border-r border-border bg-surface lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      <div className="min-w-0">
        {header && (
          <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
            {header}
          </header>
        )}

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
