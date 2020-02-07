import Timestamp from "../common/timestamp.i";

export default interface User {
    id: string;
    username: string;
    password: string;
    email?: string;
    name?: string;
    loa: number;
    created: Timestamp;
    lastActive: Timestamp;
}
