import express, { Request, Response, Router } from "express";

import UserClass from "../agents/user/user.c";
import User from "../agents/user/user.i";

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

// get all users
// TODO: check user's loa after adding passport-js-jwt auth
router.get("/omnis", (req: Request, res: Response) => {
    return UserClass
        .getAll()
        .then((users) => {
            res.status(200).json({
                error: false,
                users
            }).end();
            return;
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message
            }).end();
            return;
        });
});

// get one user
// TODO: check user's loa after adding passport-js-jwt auth
router.get("/unus/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            error: "Inavlid Payload"
        }).end();
    }
    const user: UserClass = new UserClass(id);
    return user
        .get()
        .then((data) => {
            return res.status(200).json({
                error: false,
                user: data
            }).end();
        })
        .catch((err) => {
            return res.status(500).json({
                error: err.message
            }).end();
        });
});

export default router;
