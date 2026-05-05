import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/fs-utils";
import { Skills } from "@/types";

export async function GET() {
  const data = readJson<Skills>("skills.json");
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  writeJson<Skills>("skills.json", body);
  return NextResponse.json(body);
}
