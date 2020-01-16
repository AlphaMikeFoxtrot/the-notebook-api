import Timestamp from "../../common/timestamp.i";
import Teacher from "./teacher.i";

export default class TeacherClass implements Teacher {
    public static create(name: string) {
        // generate an id
        // create a teacher object
        // push it to firestore
    }

    id: string;
    name: string;
    joined: Timestamp;
    lastActive: Timestamp;

    constructor(teacherID: string) {
        this.id = teacherID;
    }

    public get() {
        // get teacher from firestore and return it
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the teacher in firestore using this.id
    }
}
