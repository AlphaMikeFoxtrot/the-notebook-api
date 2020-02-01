import spacetime, { Spacetime } from "spacetime";

import Timestamp from "../agents/common/timestamp.i";

export default function getTimestamp(): Timestamp {
    const now: Spacetime = spacetime.now();
    const iso: string = now.format("iso") as string;
    const timestamp: number = Date.now();
    return {
        iso,
        timestamp
    };
}
