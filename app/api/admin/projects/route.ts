import { createCrudHandlers } from "@/lib/crud-handlers";
import { Project } from "@/types";

const handlers = createCrudHandlers<Project>("projects.json");

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
