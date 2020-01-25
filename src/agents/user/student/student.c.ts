import Timestamp from "../../common/timestamp.i";
import Student from "./student.i";

export default class StudentClass implements Student {
    public static create(name: string) {
        // generate an id
        // create a student object
        // push it to firestore
    }

    public id: string;
    public name: string;
    public joined: Timestamp;
    public lastActive: Timestamp;

    constructor(studentID: string) {
        this.id = studentID;
    }

    public get() {
        // get student from firestore and return it
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the student in firestore using this.id
    }
}
