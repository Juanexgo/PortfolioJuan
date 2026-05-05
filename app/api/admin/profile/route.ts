import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/fs-utils";
import { Profile } from "@/types";

export async function GET() {
  const data = readJson<Profile>("profile.json");
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  writeJson<Profile>("profile.json", body);
  return NextResponse.json(body);
}
