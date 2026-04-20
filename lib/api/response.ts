import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
};

export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonCreated<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, { status: 201, ...init });
}

export function jsonNoContent(init?: ResponseInit): NextResponse {
  return new NextResponse(null, { status: 204, ...init });
}

export function jsonBadRequest(body: ApiErrorBody): NextResponse<ApiErrorBody> {
  return NextResponse.json(body, { status: 400 });
}

export function jsonNotFound(body: ApiErrorBody): NextResponse<ApiErrorBody> {
  return NextResponse.json(body, { status: 404 });
}

export function jsonServerError(body: ApiErrorBody): NextResponse<ApiErrorBody> {
  return NextResponse.json(body, { status: 500 });
}

export function zodErrorToFields(err: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const path = issue.path.join(".") || "root";
    if (!fields[path]) fields[path] = issue.message;
  }
  return fields;
}
