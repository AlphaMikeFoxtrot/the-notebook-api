import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid from "nanoid";
import spacetime, { Spacetime } from "spacetime";

import getTimestamp from "../../lib/getTimestamp";
import globalConfig from "../../lib/global";
import initializeFirebase from "../../lib/initFirebase.js";
import Parent from "../common/parent.c";
import Timestamp from "../common/timestamp.i";
import Course from "./course.i";

initializeFirebase();

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.courses);

export default class CourseClass extends Parent implements Course {
    public static create(name: string) {
        // generate an id
        const id: string = nanoid();
        // create timestamps
        const timestamp: Timestamp = getTimestamp();
        const created = timestamp;
        const lastUpdated = timestamp;
        // create a course object
        const course: Course = {
            created,
            id,
            lastUpdated,
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
                throw new Error(err);
            });
    }

    public static fetchAll() {
        // fetch all courses from firestore

        return ref
            .get()
            .then(async (docs: admin.firestore.QuerySnapshot) => {
                const courses: any[] = [];
                await docs.forEach((doc) => {
                    courses.push(doc.data());
                });

                return courses;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public id: string;
    public name: string;
    public created: Timestamp;
    public lastUpdated: Timestamp;

    constructor(courseID: string) {
        super(ref, courseID, "subjects", "documents");
        this.id = courseID;
    }

    public get() {
        // get course from firestore and return it
        return ref
            .doc(this.id)
            .get()
            .then((doc: admin.firestore.DocumentSnapshot) => {
                if (!doc.exists) {
                    throw new Error("Resource does not exists");
                }
                const course = doc.data();
                return course;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public updateName(newName: string) {
        // update the course in firestore using this.id
        return ref
            .doc(this.id)
            .update({
                lastUpdated: getTimestamp(),
                name: newName,
            })
            .then((value: admin.firestore.WriteResult) => {
                if (_.isEmpty(value)) {
                    throw new Error("[404] requested resource does not exist");
                }
                return value;
            })
            .catch((err: any) => {
                throw new Error("requested resource doesn't exist");
            });
    }

    public async addChild(childID: string): Promise<admin.firestore.WriteResult> {
        let parent: admin.firestore.DocumentSnapshot;
        let child: admin.firestore.DocumentSnapshot;
        try {
            parent = await ref.doc(this.id).get();
            child = await admin.firestore().collection(firestore.collections.subjects).doc(childID).get();
            if (parent.exists) {        // check if parent exists
                if (child.exists) {     // check if child exists
                    return ref
                        .doc(this.id)
                        .update({
                            lastUpdated: getTimestamp(),
                            subjects: admin.firestore.FieldValue.arrayUnion(child.ref),
                        })
                        .then((value: admin.firestore.WriteResult) => {
                            return value;
                        })
                        .catch((err: any) => {
                            throw new Error(err);
                        });
                } else {
                    throw new Error("Child resource not found");
                }
            } else {
                throw new Error("Parent resource not found");
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    public removeChild(child: string): Promise<admin.firestore.WriteResult> {
        return ref
            .doc(this.id)
            .update({
                lastUpdated: getTimestamp(),
                subjects: admin.firestore.FieldValue.arrayRemove(child),
            })
            .then((result: admin.firestore.WriteResult) => {
                return result;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public delete(): Promise<any> {
        return ref
            .doc(this.id)
            .delete()
            .then((value: admin.firestore.WriteResult) => {
                return value;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }
}
