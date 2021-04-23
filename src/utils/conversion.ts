import * as stream from "stream";
import User from "../models/User";

export const convertToObject = (request: string | object | stream.Readable | Buffer) => {
    let object = JSON.stringify(request);
    return JSON.parse(object);
};
