import * as admin from "firebase-admin";
import _ from "lodash";
import nanoid from "nanoid";

import getTimestamp from "../../lib/getTimestamp";
import globalConfig from "../../lib/global";
import initializeFirebase from "../../lib/initFirebase";
import Parent from "../common/parent.c";
import Timestamp from "../common/timestamp.i";
import Document from "./document.i";

initializeFirebase();

const { firestore } = globalConfig.firebase;
const db = admin.firestore();
const ref = db.collection(firestore.collections.documents);

export default class DocumentClass extends Parent implements Document {
    public static create(name: string, data: string) {
        if (!DocumentClass.validateDocument(data)) {
            throw new Error("Invalid document data");
        }

        // generate an id
        const id: string = nanoid();
        // create timestamps
        const timestamp: Timestamp = getTimestamp();
        const created = timestamp;
        const lastUpdated = timestamp;
        // create a document object
        const document: Document = {
            created,
            data,
            id,
            lastUpdated,
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

    public static validateDocument(document: string): boolean {
        const reg = new RegExp("^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$");
        return reg.test(document);
    }

    public static fetchAll() {
        // fetch all documents from firestore

        return ref
            .get()
            .then(async (docs: admin.firestore.QuerySnapshot) => {
                const documents: any[] = [];
                await docs.forEach((doc) => {
                    documents.push(doc.data());
                });

                return documents;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    public id: string;
    public data: string;
    public name: string;
    public created: Timestamp;
    public lastUpdated: Timestamp;

    constructor(documentID: string) {
        super(ref, documentID);
        this.id = documentID;
    }

    public updateName(newName: string) {
        // update the document in firestore using this.id
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

    public updateData(newData: string) {
        if (!DocumentClass.validateDocument(newData)) {
            throw new Error("Invalid document data");
        }

        return ref
            .doc(this.id)
            .get()
            .then((document: admin.firestore.DocumentSnapshot) => {
                if (!document.exists) {
                    throw new Error("Resource not found");
                }
                return ref.doc(this.id).update({
                    data: newData
                });
            })
            .then((value: admin.firestore.WriteResult) => {
                return value;
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
