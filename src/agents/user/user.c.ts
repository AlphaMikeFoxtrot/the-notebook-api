import bcrypt from "bcrypt";
import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid = require("nanoid");

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
    public static async register(newUser: any): Promise<User> {
        // generate an id
        const id: string = nanoid();
        const { username, name, email, password, loa = 0, course } = newUser;
        let courseData: admin.firestore.DocumentSnapshot;
        courseData = await admin.firestore().collection(firestore.collections.courses).doc(course).get();
        console.log(courseData.data());
        if (!courseData.exists) {
            throw new Error("Invalid Course");
        }
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
                course: courseData.ref,
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

    public id: string;
    public username: string;
    public password: string;
    public course: admin.firestore.DocumentReference;
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
            const courseSnapshot: admin.firestore.DocumentSnapshot = await user.course.get();
            const course = courseSnapshot.data();
            return {
                ...user,
                course: _.omit(course, "subjects")
            };
        } catch (err) {
            throw new Error(err);
        }
    }
}
