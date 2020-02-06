import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid from "nanoid";
import spacetime, { Spacetime } from "spacetime";

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
        console.log("fetchall called");
        return ref
            .get()
            .then(async (docs: admin.firestore.QuerySnapshot) => {
                const departments: any[] = [];
                await docs.forEach((doc) => {
                    departments.push(doc.data());
                });
                console.log("departments", JSON.stringify(departments));
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

    public getChildren(): any[] | void {
        // check if department has already been fetched
        // if true, then use this.children(TODO) to fetch children
        // else, fetch the department from firestore and then fetch the children
    }

    public addChild(childID: string): Promise<admin.firestore.WriteResult> {
        // TODO: check if parent and child exist before pushing
        return admin
            .firestore()
            .collection(firestore.collections.departments)
            .doc(this.id)
            .update({
                courses: admin.firestore.FieldValue.arrayUnion(childID)
            })
            .then((value: admin.firestore.WriteResult) => {
                return value;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public removeChild(child: string): Department | void {
        // check if department has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        /* else, fetch the department from firestore,
           add new child to department's children and
           then update data in firestore
        */
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
