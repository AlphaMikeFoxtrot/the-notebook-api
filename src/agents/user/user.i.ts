import * as admin from "firebase-admin";

import Timestamp from "../common/timestamp.i";

export default interface User {
    id: string;
    username: string;
    password: string;
    course: admin.firestore.DocumentReference;
    email?: string;
    name?: string;
    loa: number;
    created: Timestamp;
    lastActive: Timestamp;
}
