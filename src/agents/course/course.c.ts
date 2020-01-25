import * as admin from "firebase-admin";
import nanoid from "nanoid";
import spacetime, { Spacetime } from "spacetime";

import key from "../../assets/keys/serviceAccountkey.json";
import globalConfig from "../../lib/global";
import Timestamp from "../common/timestamp.i";
import Course from "./course.i";

admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: "https://the-notebook-fd924.firebaseio.com"
});

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.courses);

export default class CourseClass implements Course {
    public static create(name: string) {
        // generate an id
        const id: string = nanoid();
        // create timestamps
        const now: Spacetime = spacetime.now();
        const iso: string = now.format("iso") as string;
        const timestamp: number = Date.now();
        // create a course object
        const course: Course = {
            created: {
                iso,
                timestamp
            },
            id,
            lastUpdated: {
                iso,
                timestamp
            },
            name,
        };
        // push it to firestore
        return ref
            .doc(id)
            .set(course)
            .then(() => {
                return course;
            })
            .catch((err: any) => {
                throw new Error(err.message);
            });
    }

    public static fetchAll() {
        // fetch all courses from firestore
    }

    public id: string;
    public name: string;
    public created: Timestamp;
    public lastUpdated: Timestamp;

    constructor(courseID: string) {
        this.id = courseID;
    }

    public get() {
        // get course from firestore and return it
        return ref
            .doc(this.id)
            .get()
            .then((doc: admin.firestore.DocumentSnapshot) => {
                const course = doc.data();
                return course;
            })
            .catch((err: any) => {
                throw new Error(err.message);
            });
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the course in firestore using this.id
    }

    public getChildren(): any[] | void {
        // check if course has already been fetched
        // if true, then use this.children(TODO) to fetch children
        // else, fetch the course from firestore and then fetch the children
    }

    public addChild(child: string): Course | void {
        // check if course has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        // else, fetch the course from firestore, add new child to course's children and the update data in firestore
    }

    public removeChild(child: string): Course | void {
        // check if course has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        /* else, fetch the course from firestore,
           add new child to course's children and
           then update data in firestore
        */
    }
}
