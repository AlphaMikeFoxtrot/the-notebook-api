import Timestamp from "../../common/timestamp.i";

export default interface Admin {
    id: string;
    name: string;
    joined: Timestamp;
    lastActive: Timestamp;
}
