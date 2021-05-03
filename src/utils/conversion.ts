import * as stream from "stream";

export const convertToObject = (request: string | object | stream.Readable | Buffer | undefined) => {
    let object = JSON.stringify(request);
    return JSON.parse(object);
};
