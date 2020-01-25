import Timestamp from "../../common/timestamp.i";
import Admin from "./admin.i";

export default class AdminClass implements Admin {
    public static create(name: string) {
        // generate an id
        // create a admin object
        // push it to firestore
    }

    public id: string;
    public name: string;
    public joined: Timestamp;
    public lastActive: Timestamp;

    constructor(adminID: string) {
        this.id = adminID;
    }

    public get() {
        // get admin from firestore and return it
    }

    public updateName(newName: string) {
        this.name = newName;
        // update the admin in firestore using this.id
    }
}
