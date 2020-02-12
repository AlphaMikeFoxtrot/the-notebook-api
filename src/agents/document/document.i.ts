import ITimestamp from "../common/timestamp.i";

export default interface Document {
    id: string;
    data: string;
    name: string;
    created: ITimestamp;
    lastUpdated: ITimestamp;
}
