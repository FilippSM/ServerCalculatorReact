import type { Request } from "express"

type EmptyRequestPart = Record<string, never>

/** Request с типизированным body. / Request with typed body. */
export type RequestWithBody<Body> = Request<EmptyRequestPart, unknown, Body>

/** Request с типизированными params. / Request with typed params. */
export type RequestWithParams<Params> = Request<Params>

/** Request с типизированными params и body. / Request with typed params and body. */
export type RequestWithParamsAndBody<Params, Body, ResponseBody = unknown> = Request<Params, ResponseBody, Body>
