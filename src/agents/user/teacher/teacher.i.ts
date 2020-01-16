import Timestamp from "../../common/timestamp.i";

export default interface Teacher {
    id: string;
    name: string;
    joined: Timestamp;
    lastActive: Timestamp;
}
