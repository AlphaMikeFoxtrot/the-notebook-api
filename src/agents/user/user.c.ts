import bcrypt from "bcrypt";
import * as admin from "firebase-admin";
import nanoid = require("nanoid");

import getTimestamp from "../../lib/getTimestamp";
import globalConfig from "../../lib/global";
import initializeFirebase from "../../lib/initFirebase";
import Timestamp from "../common/timestamp.i";
import User from "./user.i";

initializeFirebase();

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.users);

export default class UserClass implements User {
    public static async register(newUser: any): Promise<User> {
        // generate an id
        const id: string = nanoid();
        const { username, name, email, password, loa = 0 } = newUser;
        // check payload validity
        if (!(username && name && email && password)) {
            throw new Error("Invalid payload");
        }
        try {
            // check for duplicate resources
            const duplicate: admin.firestore.QuerySnapshot = await ref.where("username", "==", username).limit(1).get();
            if (!duplicate.empty) {
                throw new Error("Resource already exists");
            }
        } catch (err) {
            throw new Error(err);
        }
        // create timestamps
        const timestamp: Timestamp = getTimestamp();
        const created = timestamp;
        const lastActive = timestamp;
        try {
            const hash = await bcrypt.hashSync(password, globalConfig.hash.salts);
            const user: User = {
                created,
                id,
                lastActive,
                loa,
                name,
                password: hash,
                username,
            };
            await ref.doc(id).set(Object.assign(user, email && { email }));
            return user;
        } catch (err) {
            throw new Error(err);
        }
    }

    public id: string;
    public username: string;
    public password: string;
    public email?: string;
    public name?: string;
    public loa: number = 0;
    public created: Timestamp;
    public lastActive: Timestamp;
}
