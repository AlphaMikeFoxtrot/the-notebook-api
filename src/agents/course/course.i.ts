import ITimestamp from "../common/timestamp.i";

export default interface Course {
    id: string;
    name: string;
    created: ITimestamp;
    lastUpdated: ITimestamp;
}