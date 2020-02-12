import * as admin from "firebase-admin";

import ITimestamp from "../common/timestamp.i";

export default interface Subject {
    id: string;
    name: string;
    created: ITimestamp;
    lastUpdated: ITimestamp;
    documents?: admin.firestore.DocumentReference[];
}
