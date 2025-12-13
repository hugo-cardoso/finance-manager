import type * as React from "react";
import { useMemo } from "react";

import { useUser } from "@/hooks/queries/useUser";
import { cn } from "@/lib/utils";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  }
  if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  }
  return "Boa noite";
}

function formatDate(): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("pt-BR", options);
}

export function GreetingWidget({ className, ...props }: React.ComponentProps<"div">) {
  const { data: user } = useUser();

  const userName = useMemo(() => {
    return user ? user.name : "Usuário";
  }, [user]);

  const greeting = useMemo(() => getGreeting(), []);
  const formattedDate = useMemo(() => formatDate(), []);

  return (
    <div
      data-slot="greeting-widget"
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-linear-to-br from-[#0070F3] to-[#0051CC] p-6 shadow-lg",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, transparent 1px, transparent 10px, rgba(255,255,255,0.3) 11px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, transparent 1px, transparent 10px, rgba(255,255,255,0.3) 11px),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, transparent 1px, transparent 15px, rgba(255,255,255,0.2) 16px)
          `,
        }}
      />
      <div className="relative z-10 flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">
          {greeting}, {userName}! 👋
        </h2>
        <p className="text-base font-normal text-white/90">{formattedDate}</p>
      </div>
    </div>
  );
}
