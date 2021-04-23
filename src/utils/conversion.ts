import * as stream from "stream";
import User from "../models/User";

export const convertToObject = (request: string | object | stream.Readable | Buffer) => {
    let object = JSON.stringify(request);
    return JSON.parse(object);
};


export const initTeamObject = (request: string | object | stream.Readable | Buffer) => {
    let object = JSON.stringify(request);
    let jsonParse = JSON.parse(object);
    jsonParse['listEmployee'] = []
    return jsonParse
}
