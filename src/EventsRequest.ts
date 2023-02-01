import { Request } from "express";

export interface EventsRequest extends Request {
    token: string,
    headers: Record<string, string>,
}