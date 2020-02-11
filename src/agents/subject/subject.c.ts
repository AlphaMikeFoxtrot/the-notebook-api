import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid from "nanoid";
import spacetime, { Spacetime } from "spacetime";

import getTimestamp from "../../lib/getTimestamp";
import globalConfig from "../../lib/global";
import initializeFirebase from "../../lib/initFirebase.js";
import Timestamp from "../common/timestamp.i";
import Subject from "./subject.i";

initializeFirebase();

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.subjects);

export default class SubjectClass implements Subject {
    public static create(name: string) {
        // generate an id
        const id: string = nanoid();
        // create timestamps
        const timestamp: Timestamp = getTimestamp();
        const created = timestamp;
        const lastUpdated = timestamp;
        // create a subject object
        const subject: Subject = {
            created,
            id,
            lastUpdated,
            name,
        };
        // push it to firestore
        return ref
            .doc(id)
            .set(subject)
            .then(() => {
                return subject;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public static fetchAll() {
        // fetch all subjects from firestore

        return ref
            .get()
            .then(async (docs: admin.firestore.QuerySnapshot) => {
                const subjects: any[] = [];
                await docs.forEach((doc) => {
                    subjects.push(doc.data());
                });

                return subjects;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public id: string;
    public name: string;
    public created: Timestamp;
    public lastUpdated: Timestamp;

    constructor(subjectID: string) {
        this.id = subjectID;
    }

    public get() {
        // get subject from firestore and return it
        return ref
            .doc(this.id)
            .get()
            .then((doc: admin.firestore.DocumentSnapshot) => {
                const subject = doc.data();
                return subject;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public updateName(newName: string) {
        // update the subject in firestore using this.id
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
        // check if subject has already been fetched
        // if true, then use this.children(TODO) to fetch children
        // else, fetch the subject from firestore and then fetch the children
    }

    public addChild(child: string): Subject | void {
        // check if subject has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        // else, fetch the subject from firestore, add new child to subject's children and the update data in firestore
    }

    public removeChild(child: string): Subject | void {
        // check if subject has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        /* else, fetch the subject from firestore,
           add new child to subject's children and
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
