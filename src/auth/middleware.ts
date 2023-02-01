import { Request, Response } from "express";
import { authConfig } from "./config";
import AADTokenInfo from "./AADTokenInfo";


const either_write_all = (req: Request, res: Response, next: any) => {
    const user: AADTokenInfo = req.authInfo!;
    if (user.scp == authConfig.permssions.write) {
        return next();
    }
    return res.status(401).send("Invalid application caller.");
}

const permissions = {
    either: {
        write: either_write_all
    }

}

export {permissions}