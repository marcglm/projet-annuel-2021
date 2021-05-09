import env = require('dotenv');
import {init} from "./initServer";
env.config();

const start = async () => {
    let server = await init()
    await server.start()
    console.log(`Started server, listening on ${server.info.uri}`);

}

process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});

start()


