import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Define the interface for the request object
interface Irequest extends Request {
  payload?: any;
}

// Define the type for the authentication middleware
type Auth = (req: Irequest, res: Response, next: NextFunction) => void;

// Define the authentication middleware function
export const authentication: Auth = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) throw "Forbidden";

    // Verify the JWT token and get the payload
    const payload = jwt.verify(token, process.env.SECRET || "") as any;

    // Assign the payload to the request object
    req.payload = payload;

    next(); // Proceed to the next middleware
  } catch (error) {
    // Handle the error if JWT verification fails
    return res.status(401).json({
      msg: "Forbidden 🚫🚫🚫",
    });
  }
};
