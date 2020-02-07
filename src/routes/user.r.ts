import express, { Request, Response, Router } from "express";

import UserClass from "../agents/user/user.c";
import { NewUser, User } from "../agents/user/user.i";

const router: Router = express.Router();

// create a new user(register)
router.post("/register", (req: Request, res: Response) => {
    const newUser: any = req.body;
    return UserClass
        .register(newUser)
        .then((user: User) => {
            return res.status(200).json({
                error: false,
                user
            }).end();
        })
        .catch((err) => {
            return res.status(500).json({
                error: err.message
            }).end();
        });
});

export default router;
