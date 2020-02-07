import Timestamp from "../common/timestamp.i";

export interface NewUser {
    username: string;
    password: string;
    email?: string;
    name?: string;
    loa: number;
}

export interface User {
    id: string;
    username: string;
    password: string;
    email?: string;
    name?: string;
    loa: number;
    created: Timestamp;
    lastActive: Timestamp;
}
