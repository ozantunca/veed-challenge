import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  jsonBadRequest,
  jsonCreated,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import { getVideoRepository } from "@/lib/repositories";
import { createVideoBodySchema } from "@/lib/validation/video";

export async function CreateVideoRoute(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonBadRequest({
        error: { code: "INVALID_JSON", message: "Request body must be JSON" },
      });
    }

    const parsed = createVideoBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonBadRequest({
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fields: zodErrorToFields(parsed.error),
        },
      });
    }

    const repo = getVideoRepository();
    const video = await repo.create({
      title: parsed.data.title,
      tags: parsed.data.tags ?? [],
    });

    revalidatePath("/");

    return jsonCreated({ video });
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to create video" },
    });
  }
}
