import { NextResponse } from "next/server";

type ApiResponseError = {
  code: string;
  message: string;
  details?: string;
};

export function apiError(error: ApiResponseError, status: number = 500) {
  return NextResponse.json(error, { status });
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
