import Timestamp from "../common/timestamp.i";
import Subject from "./subject.i";

export default class SubjectClass implements Subject {
    public static create(name: string) {
        // generate an id
        // create a subject object
        // push it to firestore
    }

    public static fetchAll() {
        // fetch all subjects from firestore
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
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the subject in firestore using this.id
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
}
