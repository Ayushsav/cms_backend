import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {CustomRequest} from "../../typeReq/customReq";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({message: "Unauthorized: No token provided"});
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({message: "Unauthorized: Token missing"});
      return;
    }

    // Verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Attach decoded data to `req.user`
    req.user = decoded;
    const userid = req.user;
    userid;
    console.log("req.user", req.user);
    // Call `next()` to pass control to the next middleware/handler
    next();
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
    res.status(403).json({message: "Forbidden: Invalid token"});
  }
};

export default verifyToken;
