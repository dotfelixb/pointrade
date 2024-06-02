import { Request, Response } from "express";
import { UserVerify } from "../types";
import { checkEmailVerified } from "../models/userDatabase";

export const useAlreadyVerified = async (
    req: Request,
    res: Response,
    next: () => void
) => {
    const { email, token } = req.query as UserVerify;
    var verified = await checkEmailVerified(email);

    if(verified) {
        return res.status(302).json({ message: "Email already verified" });
    }

    next();
}