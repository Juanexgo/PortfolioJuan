import { createCrudHandlers } from "@/lib/crud-handlers";
import { Experience } from "@/types";

const handlers = createCrudHandlers<Experience>("experience.json");

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
