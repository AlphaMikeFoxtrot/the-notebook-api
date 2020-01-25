import Timestamp from "../common/timestamp.i";
import Course from "./course.i";

export default class CourseClass implements Course {
    public static create(name: string) {
        // generate an id
        // create a course object
        // push it to firestore
    }

    public static fetchAll() {
        // fetch all courses from firestore
    }

    public id: string;
    public name: string;
    public created: Timestamp;
    public lastUpdated: Timestamp;

    constructor(courseID: string) {
        this.id = courseID;
    }

    public get() {
        // get course from firestore and return it
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the course in firestore using this.id
    }

    public getChildren(): any[] | void {
        // check if course has already been fetched
        // if true, then use this.children(TODO) to fetch children
        // else, fetch the course from firestore and then fetch the children
    }

    public addChild(child: string): Course | void {
        // check if course has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        // else, fetch the course from firestore, add new child to course's children and the update data in firestore
    }

    public removeChild(child: string): Course | void {
        // check if course has already been fetched
        // if true, add child to this.children(TODO) then update data in firestore
        /* else, fetch the course from firestore,
           add new child to course's children and
           then update data in firestore
        */
    }
}
