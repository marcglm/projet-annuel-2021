import * as HapiSwagger from "hapi-swagger";
import Hapi = require('@hapi/hapi');
import HapiInert = require('@hapi/inert')
import Vision = require('@hapi/vision')

const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
        title: 'API Documentation',
    }
};

export const pluginsSwagger: Array<Hapi.ServerRegisterPluginObject<any>> =
    [
        {
            plugin: HapiInert
        },
        {
            plugin: Vision
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]
