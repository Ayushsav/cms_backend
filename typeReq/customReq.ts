import { Request } from "express";

// Custom type extending Request to include `user`
export interface CustomRequest extends Request {
  user?: any; // Replace `any` with your specific `User` type if available
}
