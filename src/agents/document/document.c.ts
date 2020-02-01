import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid from "nanoid";
import spacetime, { Spacetime } from "spacetime";

import globalConfig from "../../lib/global";
import initializeFirebase from "../../lib/initFirebase";
import Timestamp from "../common/timestamp.i";
import Document from "./document.i";

initializeFirebase();

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.documents);

export default class DocumentClass implements Document {
    public static create(name: string) {
        // generate an id
        const id: string = nanoid();
        // create timestamps
        const now: Spacetime = spacetime.now();
        const iso: string = now.format("iso") as string;
        const timestamp: number = Date.now();
        // create a document object
        const document: Document = {
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
            .set(document)
            .then(() => {
                return document;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public static fetchAll() {
        // fetch all documents from firestore
        console.log("fetchall called");
        return ref
            .get()
            .then(async (docs: admin.firestore.QuerySnapshot) => {
                const documents: any[] = [];
                await docs.forEach((doc) => {
                    documents.push(doc.data());
                });
                console.log("documents", JSON.stringify(documents));
                return documents;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public id: string;
    public name: string;
    public created: Timestamp;
    public lastUpdated: Timestamp;

    constructor(documentID: string) {
        this.id = documentID;
    }

    public get() {
        // get document from firestore and return it
        return ref
            .doc(this.id)
            .get()
            .then((doc: admin.firestore.DocumentSnapshot) => {
                const document = doc.data();
                return document;
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    }

    public updateName(newName: string) {
        // update the document in firestore using this.id
        return ref
            .doc(this.id)
            .update({
                name: newName
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
        // check if document has already been fetched
        // if true, then use this.children(TODO) to fetch children
        // else, fetch the document from firestore and then fetch the children
    }

    public addChild(child: string): Document | void {
        // check if document has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        // else, fetch the document from firestore, add new child to document's
           // children and the update data in firestore
    }

    public removeChild(child: string): Document | void {
        // check if document has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        /* else, fetch the document from firestore,
           add new child to document's children and
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
