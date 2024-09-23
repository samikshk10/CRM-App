import { NextFunction, Request, Response } from "express";
const exceptionHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));

export default exceptionHandler;
