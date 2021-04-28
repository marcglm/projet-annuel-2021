import Hapi = require('@hapi/hapi');
import {init} from "../initServer";
import UserRepository from "../src/repository/UserRepository";



describe("Test des routes", async () => {

    let server: Hapi.Server;

    beforeEach(async () => {
        server = await init()
    })
    afterEach(async () => {
       await server.stop();
    });

    it("should add user with success", async () => {
        const EMAIL_USER = "duponddupondm@hotmail.fr"
        await UserRepository.delete(EMAIL_USER);

        const response = await server.inject({
            method: "POST",
            url: '/signup',
            payload:{
                email: EMAIL_USER,
                password: "000000",
                password2:"000000",
                firstName:"John",
                lastName:"Allou"
            }
        });


        const payload = JSON.parse(response.payload);
        console.log(response)
        //expect(payload.error).to.equal("Bad Request");
        expect(response.statusCode).toEqual(200)

        //expect(payload.id_token).exist
        await UserRepository.delete(EMAIL_USER);

    });


})