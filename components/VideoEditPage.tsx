"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TagChipInput } from "@/components/TagChipInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ApiErrorBody } from "@/lib/api/response";
import { updateVideoFormSchema } from "@/lib/validation/video";
import type { Video } from "@/lib/types/video";
import type { z } from "zod";

import { useToastStore } from "@/lib/stores/toast-store";

type FormValues = z.input<typeof updateVideoFormSchema>;

export function VideoEditPage({ video }: { video: Video }) {
  const router = useRouter();
  const pushToast = useToastStore((s) => s.push);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateVideoFormSchema),
    defaultValues: {
      title: video.title,
      description: video.description,
      tags: video.tags,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    const res = await fetch(`/api/videos/${video.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description ?? "",
        tags: data.tags ?? [],
      }),
    });

    const json = (await res.json()) as unknown;
    if (!res.ok) {
      const err = json as ApiErrorBody;
      if (err?.error?.fields) {
        for (const [key, message] of Object.entries(err.error.fields)) {
          if (key === "title") setError("title", { message });
          else if (key === "description") setError("description", { message });
          else if (key === "tags" || key.startsWith("tags."))
            setError("tags", { message });
        }
      }
      setSubmitError(err?.error?.message ?? "Could not save video");
      return;
    }

    pushToast({
      title: "Video updated",
      description: data.title,
    });
    router.push(`/videos/${video.displayId}`);
    router.refresh();
  });

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link
        href={`/videos/${video.displayId}`}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Back to video
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Edit video</h1>
      <p className="text-sm text-muted-foreground">
        Update title, description, and tags.
      </p>

      <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            autoComplete="off"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title?.message ? (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            rows={5}
            aria-invalid={!!errors.description}
            placeholder="Optional notes or script outline"
            {...register("description")}
          />
          {errors.description?.message ? (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagChipInput
              id="edit-tags"
              value={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
              error={errors.tags?.message as string | undefined}
              disabled={isSubmitting}
            />
          )}
        />

        {submitError ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
          <Button asChild variant="outline" type="button">
            <Link href={`/videos/${video.displayId}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
