import express,{Request,Response,NextFunction} from "express"
import * as ErrorCollection from "../errors"
const ADMIN_ROLE = "ADMIN";
const MEMBER_ROLE = "USER";

async function checkMemberRole(req: Request, res: Response, next: NextFunction) {

  console.log('check', (req as any).payload.role === MEMBER_ROLE);
  if (
    (req as any).payload.role === ADMIN_ROLE ||
    (req as any).payload.role === MEMBER_ROLE
  ) {
      
    next();
  } else {
    next (new ErrorCollection.NotAuthorizedError())
  }
}

async function checkAdminRole(req: Request, res: Response, next: NextFunction) {
  if ((req as any).payload.role === ADMIN_ROLE) {
    next();
  } else {
    next (new ErrorCollection.NotAuthorizedError())

  }
}
export {checkMemberRole,checkAdminRole}
