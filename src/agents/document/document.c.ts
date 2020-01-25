import Timestamp from "../common/timestamp.i";
import Document from "./document.i";

export default class DocumentClass implements Document {
    public static create(name: string) {
        // generate an id
        // create a document object
        // push it to firestore
    }

    public static fetchAll(parent: string) {
        // fetch parent's all documents from firestore
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
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the document in firestore using this.id
    }
}
