import { cn } from "@/lib/utils";

interface AdminStatusBadgeProps {
  children: string;
  tone?: "default" | "success" | "warning" | "danger";
}

export function AdminStatusBadge({
  children,
  tone = "default",
}: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        tone === "default" && "border border-border bg-white text-brand-deep",
        tone === "success" && "bg-emerald-100 text-emerald-800",
        tone === "warning" && "bg-amber-100 text-amber-800",
        tone === "danger" && "bg-red-100 text-red-700",
      )}
    >
      {children.replace(/_/g, " ")}
    </span>
  );
}
