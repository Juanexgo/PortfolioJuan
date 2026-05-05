import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/fs-utils";
import { Message } from "@/types/message";

export async function GET() {
  const messages = readJson<Message[]>("messages.json");
  return NextResponse.json(messages);
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const messages = readJson<Message[]>("messages.json");
  const index = messages.findIndex((msg) => msg.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  messages[index] = { ...messages[index], read: true };
  writeJson("messages.json", messages);

  return NextResponse.json(messages[index]);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const messages = readJson<Message[]>("messages.json");
  const filtered = messages.filter((msg) => msg.id !== id);

  if (filtered.length === messages.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  writeJson("messages.json", filtered);
  return NextResponse.json({ success: true });
}
