import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid from "nanoid";

import getTimestamp from "../../lib/getTimestamp";
import globalConfig from "../../lib/global";
import initializeFirebase from "../../lib/initFirebase.js";
import Timestamp from "../common/timestamp.i";
import Department from "./department.i";

initializeFirebase();

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.departments);

export default class DepartmentClass implements Department {
    public static create(name: string) {
        // generate an id
        const id: string = nanoid();
        // create timestamps
        const timestamp: Timestamp = getTimestamp();
        const created = timestamp;
        const lastUpdated = timestamp;
        // create a department object
        const department: Department = {
            created,
            id,
            lastUpdated,
            name,
        };
        // push it to firestore
        return ref
            .doc(id)
            .set(department)
            .then(() => {
                return department;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public static fetchAll() {
        // fetch all departments from firestore
        return ref
            .get()
            .then(async (docs: admin.firestore.QuerySnapshot) => {
                const departments: any[] = [];
                await docs.forEach((doc) => {
                    departments.push(doc.data());
                });
                return departments;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public id: string;
    public name: string;
    public created: Timestamp;
    public lastUpdated: Timestamp;

    constructor(departmentID: string) {
        this.id = departmentID;
    }

    public get() {
        // get department from firestore and return it
        return ref
            .doc(this.id)
            .get()
            .then((doc: admin.firestore.DocumentSnapshot) => {
                const department = doc.data();
                return department;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public updateName(newName: string) {
        // update the department in firestore using this.id
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

    public getChildren(): Promise<any> {
        // check if department exists
        return ref
            .doc(this.id)
            .get()
            .then((department: admin.firestore.DocumentSnapshot) => {
                if (!department.exists) {
                    throw new Error("Resource not found");
                }
                const courseIDs: admin.firestore.DocumentReference[] = department.data().courses;
                const promises: any[] = [];
                courseIDs.forEach((courseID: admin.firestore.DocumentReference) => {
                    promises.push(courseID.get());
                });
                return Promise.all(promises);
            })
            .then((courses) => {
                const populated: any[] = [];
                courses.forEach((course: admin.firestore.DocumentSnapshot) => {
                    populated.push(_.omit(course.data(), "subjects"));
                });
                return populated;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public async addChild(childID: string): Promise<admin.firestore.WriteResult> {
        let parent: admin.firestore.DocumentSnapshot;
        let child: admin.firestore.DocumentSnapshot;
        try {
            parent = await ref.doc(this.id).get();
            child = await admin.firestore().collection(firestore.collections.courses).doc(childID).get();
            if (parent.exists) {        // check if parent exists
                if (child.exists) {     // check if child exists
                    return ref
                        .doc(this.id)
                        .update({
                            courses: admin.firestore.FieldValue.arrayUnion(child.ref),
                            lastUpdated: getTimestamp()
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
                courses: admin.firestore.FieldValue.arrayRemove(child),
                lastUpdated: getTimestamp()
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
