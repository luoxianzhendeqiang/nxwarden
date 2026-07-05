import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SignalBadgeProps = {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: "gold" | "blue" | "violet" | "green" | "neutral";
};

export default function SignalBadge({
  children,
  icon: Icon,
  tone = "neutral"
}: SignalBadgeProps) {
  return (
    <span className={`signal-badge signal-badge--${tone}`}>
      {Icon ? <Icon aria-hidden="true" size={14} strokeWidth={2.1} /> : null}
      {children}
    </span>
  );
}
