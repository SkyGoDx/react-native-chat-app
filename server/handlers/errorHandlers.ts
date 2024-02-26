import { NextFunction, Request, Response, request } from "express";
import { Login } from "../router/userRouter/user.controller";
import mongoose from "mongoose";


type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const withErrorHandling = (controller: ControllerFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            // Handle the error appropriately
            console.error('Error caught in middleware:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};


  /*
    MongoDB Validation Error Handler
  
    Detect if there are mongodb validation errors that we send them nicely back.
  */
  
  export const mongoseErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err) return next(err);
    res.status(400).json({
      message: err.message,
    });
  };
  /*
  Production Error Handler

  No stack traces and error details are leaked to the user
*/
export const developmentErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack,
  };

  res.status(err.status || 500).json(errorDetails); // send JSON back
};
export const productionErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json({
    error: "Internal Server Error",
  }); // send JSON back
};

/*
  404 Page Error
*/
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Route not found",
  });
};