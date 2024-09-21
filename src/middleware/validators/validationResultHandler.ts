import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const sanitizedErrors = errors.array().map((error) => ({
      ...error,
      value: undefined,
    }));
    return res.status(400).json({ errors: sanitizedErrors });
  }
  next();
};

export default handleValidationResult;
