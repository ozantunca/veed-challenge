"use client";

import { X } from "lucide-react";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type TagChipInputProps = {
  id?: string;
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
};

function normalizeTag(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function TagChipInput({
  id,
  label = "Tags",
  value,
  onChange,
  error,
  disabled,
  className,
}: TagChipInputProps) {
  const [draft, setDraft] = useState("");

  const commitDraft = useCallback(() => {
    const t = normalizeTag(draft);
    if (!t) return;
    if (value.includes(t)) {
      setDraft("");
      return;
    }
    if (value.length >= 32) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  }, [draft, onChange, value]);

  const removeAt = useCallback(
    (idx: number) => {
      const next = value.filter((_, i) => i !== idx);
      onChange(next);
    },
    [onChange, value],
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      ) : null}
      <div
        className={cn(
          "flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs",
          error && "border-destructive",
          disabled && "opacity-60",
        )}
      >
        {value.map((tag, idx) => (
          <Badge key={`${tag}-${idx}`} variant="secondary" className="gap-1">
            <span>{tag}</span>
            <button
              type="button"
              className="rounded-sm outline-none hover:opacity-80"
              onClick={() => removeAt(idx)}
              disabled={disabled}
              aria-label={`Remove tag ${tag}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <Input
          id={id}
          value={draft}
          disabled={disabled}
          placeholder="Add tags…"
          className="min-w-[12rem] flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          onChange={(e) => {
            const v = e.target.value;
            if (v.includes(",")) {
              const parts = v.split(",");
              const head = parts.slice(0, -1).map(normalizeTag).filter(Boolean);
              const tail = parts[parts.length - 1] ?? "";
              let next = value;
              for (const h of head) {
                if (next.includes(h)) continue;
                if (next.length >= 32) break;
                next = [...next, h];
              }
              if (next !== value) onChange(next);
              setDraft(tail);
              return;
            }
            setDraft(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitDraft();
            }
            if (e.key === "Backspace" && draft.length === 0 && value.length > 0) {
              removeAt(value.length - 1);
            }
          }}
          onBlur={() => {
            // optional: commit partial on blur if non-empty
            if (normalizeTag(draft)) commitDraft();
          }}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add a tag. Up to 32 tags.
      </p>
    </div>
  );
}
