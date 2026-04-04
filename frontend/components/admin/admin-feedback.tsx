import { cn } from "@/lib/utils";

interface AdminFeedbackProps {
  tone: "success" | "error";
  message: string;
}

export function AdminFeedback({ tone, message }: AdminFeedbackProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "error" && "border-red-200 bg-red-50 text-red-700",
      )}
    >
      {message}
    </div>
  );
}
