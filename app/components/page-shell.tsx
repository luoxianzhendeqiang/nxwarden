import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export default function PageShell({
  children,
  className = ""
}: PageShellProps) {
  return <main className={`page-shell ${className}`.trim()}>{children}</main>;
}
