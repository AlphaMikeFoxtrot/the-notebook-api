import bcrypt from "bcrypt";
import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid = require("nanoid");

import { encrypt } from "../../lib/cryptic";
import getTimestamp from "../../lib/getTimestamp";
import globalConfig from "../../lib/global";
import initializeFirebase from "../../lib/initFirebase";
import Parent from "../common/parent.c";
import Timestamp from "../common/timestamp.i";
import User from "./user.i";

initializeFirebase();

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.users);

export default class UserClass implements User {
    // tslint:disable-next-line: max-line-length
    public static async register(newUser: any): Promise<{ user: User, authToken: { iv: string, encryptedData: string } }> {
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
            // generate auth token using firebase
            const authToken: string = await admin.auth().createCustomToken(id);
            const encrypted: { iv: string, encryptedData: string } = encrypt(authToken);
            await ref.doc(id).set(Object.assign(user, email && { email }));
            return {
                authToken: encrypted,
                user,
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    public static getAll(): Promise<User[]> {
        return ref
            .get()
            .then((docs: admin.firestore.QuerySnapshot) => {
                const users: User[] = [];
                docs.forEach((doc: admin.firestore.DocumentSnapshot) => {
                    users.push(doc.data() as User);
                });
                return users;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public static async login(username: string, password: string): Promise<any> {
        // check payload's validity
        if (!username || !password) {
            throw new Error("Invalid payload");
        }
        // get user from firestore
        // tslint:disable-next-line: max-line-length
        const query: admin.firestore.QuerySnapshot = await admin.firestore().collection(firestore.collections.users).where("username", "==", username).limit(1).get();
        console.log(query.size);
        console.log(query.docs[0].data());
        if (query.size <= 0) {
            throw new Error("Resource does not exist");
        }
        let user: User;
        query.forEach((doc) => {
            user = doc.data() as User;
        });
        const { password: hashed, id } = user;
        return bcrypt
            .compare(password, hashed)
            .then((value) => {
                if (!value) {
                    throw new Error("Invalid credentials");
                }
                return admin.auth().createCustomToken(id);
            })
            .then((authToken) => {
                const encrypted: { iv: string, encryptedData: string } = encrypt(authToken);
                return {
                    ...user,
                    authToken: encrypted
                };
            })
            .catch((err) => {
                console.log(err);
                throw new Error("Invalid credentials");
            });
    }

    public id: string;
    public username: number;
    public password: string;
    public email?: string;
    public name?: string;
    public loa: number = 0;
    public created: Timestamp;
    public lastActive: Timestamp;

    constructor(id: string) {
        this.id = id;
    }

    public async get(): Promise<any> {
        try {
            const userSnapshot: admin.firestore.DocumentSnapshot = await ref.doc(this.id).get();
            const user: User = userSnapshot.data() as User;
            return user;
        } catch (err) {
            throw new Error(err);
        }
    }
}
