import Hapi = require('@hapi/hapi');
import {init} from "../initServer";



describe("Test des routes", async () => {
    const PORT = process.env.PORT || '3000';
    let server: Hapi.Server;

    beforeEach(async () => {
        server = await init()
    })
    afterEach(async () => {
       await server.stop();
    });

    it("should add user with success", async () => {

        const response = await server.inject({
            method: "POST",
            url: '/signup',
            payload:{
                email: "duponddupondm@hotmail.fr",
                password: "000000",
                password2:"000000",
                firstName:"John",
                lastName:"Allou"
            }
        });


        const payload = JSON.parse(response.payload);
        //expect(payload.error).to.equal("Bad Request");
        expect(payload.statusCode).toEqual(200)

        //expect(payload.id_token).exist

    });


})