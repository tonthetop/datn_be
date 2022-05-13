import jwt from "jsonwebtoken";
import express,{Request,Response,NextFunction} from "express"
/**
 * Authentication Token(in System)
 * Param in request.body
 * @param {object} req request from client to server
 * @param {object} res response from server to client
 * @param {function} next action to next request
 */
async function authenticationToken(req: Request, res: Response, next:NextFunction) {
    console.log("vao authen");
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]||"";
        console.log(token)
        if (!token) {
            res.statusMessage = "You dont have token!";
            res.status(401).send();
        }
        jwt.verify(token, process.env.JWT_SECRET||"tuandeptrai123", (err, payload) => {
            if (err) {
                res.statusMessage = err.message || "Token is not valid";
                console.log('payload', payload)
                res.status(401).send();
            } else {
                (req as any).payload = payload;
                next();
            }
        });
    } catch (err) {
        console.log("error", err);
        res.statusMessage = "Something error";
        res.status(500).send();
    }
}
export  {authenticationToken}
