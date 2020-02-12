import * as admin from "firebase-admin";

import ITimestamp from "../common/timestamp.i";

export default interface Department {
    id: string;
    name: string;
    created: ITimestamp;
    lastUpdated: ITimestamp;
    courses?: admin.firestore.DocumentReference[];
}
