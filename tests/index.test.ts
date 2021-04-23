import Hapi = require('@hapi/hapi');
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import {generateHapiToken} from "../src/security/tokenManagement";
import {createUser} from "../src/app/01_createAccount";
import User from "../src/models/User";
import {Server} from "@hapi/hapi";
import {init} from "../index";


describe("Test des routes", async () => {
    const PORT = process.env.PORT || '3000';
    let server: Hapi.Server;
    const PATH_BASE = '/serveur/PA2021';

    beforeEach((done) => {

        init().then(s => { server = s; done(); });
    })
    afterEach((done) => {
        server.stop().then(() => done());
    });

    it("should add user with success", async () => {

        const response = await server.inject({
            method: "POST",
            url: PATH_BASE + '/adduser/employee',
            payload:{
                email: "duponddupondm@hotmail.fr",
                password: "000000",
            }
        });


        const payload = JSON.parse(response.payload);
        //expect(payload.error).to.equal("Bad Request");
        expect(payload.statusCode).to.equal(201);

        //expect(payload.id_token).exist

    });

    it("should return bad request", async () => {

        const response = await server.inject({
            method: "POST",
            url: PATH_BASE + '/adduser/employee',
            payload: {
                _id: undefined,
                email: null,
                password: "000000",
                role: "employee"
            }
        });

        expect(response.statusCode).to.equal(400);

        const payload = JSON.parse(response.payload);

        expect(payload.error).to.equal("Bad Request");
        //expect(payload.message).to.equal("Bad Request");


    });

})