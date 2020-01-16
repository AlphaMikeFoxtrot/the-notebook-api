import ITimestamp from "../common/timestamp.i";

export default interface Department {
    id: string;
    name: string;
    created: ITimestamp;
    lastUpdated: ITimestamp;
}
