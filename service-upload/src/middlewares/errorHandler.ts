import { NextFunction, Request, Response } from "express";
import { HttpStatusEnum, ReasonPhrasesEnum } from "../enums";
import buildError from "./buildError";

/**
 * Error response middleware for 404 not found.
 */
export function notFound(req: Request, res: Response) {
  res.status(HttpStatusEnum.NOT_FOUND).json({
    success: false,
    code: HttpStatusEnum.NOT_FOUND,
    message: ReasonPhrasesEnum.NOT_FOUND,
  });
}

/**
 * Method not allowed error middleware. This middleware should be placed at
 */
export function methodNotAllowed(req: Request, res: Response) {
  res.status(HttpStatusEnum.METHOD_NOT_ALLOWED).json({
    success: false,
    code: HttpStatusEnum.METHOD_NOT_ALLOWED,
    message: ReasonPhrasesEnum.METHOD_NOT_ALLOWED,
  });
}

/**
 * Generic error response middleware for validation and internal server errors.
 */
export function genericErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.stack);
  const error = buildError(err);
  res.status(error.code).json({ ...error });
}
