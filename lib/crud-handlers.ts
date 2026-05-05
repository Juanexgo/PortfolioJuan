import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/fs-utils";

export interface CrudResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function createCrudHandlers<T extends { id: string }>(filename: string) {
  return {
    async GET() {
      const data = readJson<T[]>(filename);
      return NextResponse.json(data);
    },

    async POST(request: Request) {
      const body = await request.json();
      const data = readJson<T[]>(filename);
      const newItem: T = { ...body, id: Date.now().toString() } as T;
      data.push(newItem);
      writeJson(filename, data);
      return NextResponse.json(newItem, { status: 201 });
    },

    async PUT(request: Request) {
      const body = await request.json();
      const data = readJson<T[]>(filename);
      const index = data.findIndex((item) => item.id === body.id);

      if (index === -1) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      data[index] = body;
      writeJson(filename, data);
      return NextResponse.json(body);
    },

    async DELETE(request: NextRequest) {
      const id = request.nextUrl.searchParams.get("id");

      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }

      const data = readJson<T[]>(filename);
      const filtered = data.filter((item) => item.id !== id);

      if (filtered.length === data.length) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      writeJson(filename, filtered);
      return NextResponse.json({ success: true });
    },
  };
}
