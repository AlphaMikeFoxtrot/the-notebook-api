import Timestamp from "../common/timestamp.i";
import Department from "./department.i";

export default class DepartmentClass implements Department {
    public static create(name: string) {
        // generate an id
        // create a department object
        // push it to firestore
    }

    public static fetchAll() {
        // fetch all departments from firestore
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
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the department in firestore using this.id
    }

    public getChildren(): any[] | void {
        // check if dept has already been fetched
        // if true, then use this.children(TODO) to fetch children
        // else, fetch the dept from firestore and then fetch the children
    }

    public addChild(child: string): Department | void {
        // check if dept has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        // else, fetch the dept from firestore, add new child to dept's children and the update data in firestore
    }

    public removeChild(child: string): Department | void {
        // check if dept has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        /* else, fetch the dept from firestore,
           add new child to dept's children and
           then update data in firestore
        */
    }
}
