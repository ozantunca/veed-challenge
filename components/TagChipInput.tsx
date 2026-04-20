"use client";

import { X } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

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

function mergeDescribedBy(ids: (string | undefined)[]): string | undefined {
  const s = ids.filter(Boolean).join(" ").trim();
  return s === "" ? undefined : s;
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
  const reactId = useId();
  const inputId = id ?? `tags-${reactId}`;
  const labelId = `${inputId}-label`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const [draft, setDraft] = useState("");

  const describedBy = useMemo(
    () =>
      mergeDescribedBy([
        hintId,
        error ? errorId : undefined,
      ]),
    [hintId, errorId, error],
  );

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
        <Label id={labelId} htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
      ) : null}
      <div
        role="group"
        aria-labelledby={label ? labelId : undefined}
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
              className="rounded-sm text-secondary-foreground hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none"
              onClick={() => removeAt(idx)}
              disabled={disabled}
              aria-label={`Remove tag ${tag}`}
            >
              <X className="size-3 shrink-0" aria-hidden />
            </button>
          </Badge>
        ))}
        <Input
          id={inputId}
          value={draft}
          disabled={disabled}
          placeholder="Add tags…"
          aria-invalid={!!error}
          aria-describedby={describedBy}
          autoComplete="off"
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
              return;
            }
            if (e.key === "Escape") {
              if (draft.length > 0) {
                e.preventDefault();
                setDraft("");
              } else {
                e.preventDefault();
                e.currentTarget.blur();
              }
              return;
            }
            if (e.key === "Backspace" && draft.length === 0 && value.length > 0) {
              removeAt(value.length - 1);
            }
          }}
          onBlur={() => {
            if (normalizeTag(draft)) commitDraft();
          }}
        />
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <p id={hintId} className="text-xs text-muted-foreground">
        Press Enter or comma to add a tag. Escape clears the field or cancels. Up to
        32 tags.
      </p>
    </div>
  );
}
