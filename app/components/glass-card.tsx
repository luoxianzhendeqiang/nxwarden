import type { ComponentPropsWithoutRef, ReactNode } from "react";

type GlassCardProps = ComponentPropsWithoutRef<"article"> & {
  children: ReactNode;
};

export default function GlassCard({
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <article className={`glass-card ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}
