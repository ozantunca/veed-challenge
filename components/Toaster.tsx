"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToastStore } from "@/lib/stores/toast-store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.variant === "destructive" ? "alert" : "status"}
          aria-live={t.variant === "destructive" ? "assertive" : "polite"}
          aria-atomic="true"
          className={cn(
            "flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-card-foreground shadow-lg",
            t.variant === "destructive" &&
              "border-destructive/40 bg-destructive text-white",
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="font-medium">{t.title}</div>
            {t.description ? (
              <div className="text-sm opacity-90">{t.description}</div>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
