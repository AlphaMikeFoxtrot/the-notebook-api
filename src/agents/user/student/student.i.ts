import Timestamp from "../../common/timestamp.i";

export default interface Student {
    id: string;
    name: string;
    joined: Timestamp;
    lastActive: Timestamp;
}
