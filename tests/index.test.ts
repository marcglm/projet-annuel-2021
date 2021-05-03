import UserRepository from "../src/repository/UserRepository";
import {decodeHapiToken, generateHapiToken, HapiJwt} from "../src/security/tokenManagement";
import env = require('dotenv');
import User from "../src/models/User";
import {convertToObject} from "../src/utils/conversion";
import {Server} from "@hapi/hapi";
import {init} from "../initServer";
env.config();
const FAKER = require('faker')
const RANDOMSTRING = require("randomstring");

describe("Route's tests",() => {

    let server: Server;

    //MANAGER DATA
    const EMAIL_MANAGER = FAKER.internet.email();
    const PASSWORD_MANAGER = "managerpassword"
    const NAME_MANAGER = FAKER.name.findName()
    const FIRSTNAME_MANAGER = NAME_MANAGER.split(" ")[0];
    const LASTNAME_MANAGER = NAME_MANAGER.split(" ")[1];
    const MANAGER_ROLE = 'MANAGER'

    const MANAGER_ACCOUNT:User = {
        firstName: FIRSTNAME_MANAGER ,
        lastName: LASTNAME_MANAGER,
        email: EMAIL_MANAGER,
        password: PASSWORD_MANAGER,
        role: MANAGER_ROLE,
        pinCode:"",
        isActive: true
    }

    //EMPLOYEE DATA
    const EMAIL_EMPLOYEE = "marcghalem@hotmail.fr"
    const PASSWORD_EMPLOYEE = "000000";
    const PASSWORD2 = PASSWORD_EMPLOYEE ;
    const NAME = FAKER.name.findName()
    const FIRSTNAME_EMPLOYEE = NAME.split(" ")[0];
    const LASTNAME_EMPLOYEE = NAME.split(" ")[1];
    const EMPLOYEE_ROLE = 'EMPLOYEE'
    const PINCODE = RANDOMSTRING.generate({length: 10, charset: 'alphanumeric'});

    let EMPLOYEE_ACCOUNT: User = {
        firstName: FIRSTNAME_EMPLOYEE,
        lastName: LASTNAME_EMPLOYEE,
        email: EMAIL_EMPLOYEE,
        password: PASSWORD_EMPLOYEE,
        role:EMPLOYEE_ROLE,
        isActive: true
    }

    const TOKEN = "" + process.env.TOKEN;

    beforeAll(async () => {

        server = await init()
    })

    beforeEach(async () => {
        await UserRepository.delete(MANAGER_ACCOUNT.email)
        await UserRepository.delete(EMPLOYEE_ACCOUNT.email)

    })

    afterAll(async () => {
       await server.stop();
    });

  /*  describe("Tests of signup for an User",()=> {



        it("should return 400 when password is missing",async () => {

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email:EMAIL,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"password\" is required")
        })

        it("should return 400 when password is empty",async () => {

            //GIVEN
            const EMPTY_PASSWORD = ''

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email:EMAIL,
                    password: EMPTY_PASSWORD,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe('\"password\" is not allowed to be empty')
        })

        it("should return 400 when password2 is missing",async () => {

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email: EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"password2\" is required")
        })

        it("should return 400 when password2 is empty",async () => {

            //GIVEN
            const EMPTY_PASSWORD2 = ''

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email:EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: EMPTY_PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"password2\" must be [ref:password]")
        })

        it("should return 400 when password2 and password are not identical",async () => {

            //GIVEN
            const PASSWORD2_INVALID = "invalidpassword" ;

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email: EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2_INVALID,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"password2\" must be [ref:password]")
        })

        it("should return 400 when firstname is missing",async () => {

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email: EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"firstName\" is required")
        })

        it("should return 400 when firstname is empty",async () => {
            //GIVEN
            const FIRSTNAME_EMPTY = ''

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email: EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName:FIRSTNAME_EMPTY,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"firstName\" is not allowed to be empty")

        })

        it("should return 400 when lastname is empty",async () => {
            //GIVEN
            const LASTNAME_EMPTY = ''

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email: EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName:FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPTY
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"lastName\" is not allowed to be empty")

        })

        it("should return 400 when lastname is missing",async () => {


            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email: EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "\"lastName\" is required")
        })

       /* it("should return Bad request when email already exist", async () => {

            //GIVEN
            let user: User = {
                firstName: FIRSTNAME_EMPLOYEE,
                lastName: LASTNAME_EMPLOYEE,
                email: EMAIL,
                manager:EMAIL_MANAGER,
                password: PASSWORD_EMPLOYEE,
                isActive: true
            }

            await UserRepository.insert(user)

            //WHEN
            const errorResponse = await server.inject({
                method: "POST",
                url: '/signup',
                payload: {
                    email: EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(errorResponse.result);

            expect(errorResponse.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("Email already exist")


        })


    })*/

    describe("Tests of /signin",()=> {

        it("should return 400 when email is empty", async () => {
            //GIVEN
            const EMAIL_EMPTY = '';

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signin',
                payload: {
                    email: EMAIL_EMPTY,
                    password: PASSWORD_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"email\" is not allowed to be empty")
        })

        it("should return 400 when email is missing", async () => {

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signin',
                payload: {
                    password: PASSWORD_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "\"email\" is required")
        })

        it("should return 400 when email field is not valid", async () => {
            //GIVEN
            const EMAIL_NOT_VALID = "notvalid@.fr"

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signin',
                payload: {
                    email: EMAIL_NOT_VALID,
                    password: PASSWORD_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"email\" must be a valid email")
        })

        it("should return 400 when email don't exist in database", async () => {

            //GIVEN
            const EMAIL_NON_EXISTENT = FAKER.internet.email();
            await UserRepository.delete(EMAIL_NON_EXISTENT);

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signin',
                payload: {
                    email: EMAIL_NON_EXISTENT,
                    password: PASSWORD_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "No such user")
        })

        it("should return 400 when password is wrong", async () => {

            //GIVEN
            await UserRepository.insert(EMPLOYEE_ACCOUNT)
            const PASSWORD_WRONG = "wrongpaswword";

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signin',
                payload: {
                    email: EMAIL_EMPLOYEE,
                    password: PASSWORD_WRONG
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "Wrong password")
        })

        it("should return 400 when password is missing", async () => {

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signin',
                payload: {
                    email: EMAIL_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "\"password\" is required")
        })

        it("should return 400 when password is empty", async () => {
            //GIVEN
            const PASSWORD_EMPTY = "";

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/signin',
                payload: {
                    email: EMPLOYEE_ACCOUNT.email,
                    password:PASSWORD_EMPTY
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "\"password\" is not allowed to be empty")
        })

    })

    describe("Tests of /invite",()=> {

        it("should return 401 when token is invalid", async () => {
            //GIVEN
            let user: User = {
                firstName: "",
                lastName: "",
                email: EMAIL_EMPLOYEE,
                password: PASSWORD_EMPLOYEE,
                role: MANAGER_ROLE,
                isActive: true
            }
            await UserRepository.insert(user)

            const INVALID_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VuIjoiNjA4ODNkZjc5ZmUxZjEyMGM0MmY4MDBjIiwic2NvcGUiOiJNQU5BR0VSIiwiaxfQ.WBL-hHVw4gcrcUc2ZYIH3ukrUI-tu3e1yAfZRgQLtJU"

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/invite',
                headers: {
                    Authorization: INVALID_TOKEN
                },
                payload: {
                    email: EMAIL_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(responseParsed.statusCode).toBe(401)
            expect(responseParsed.message).toBe("Invalid token payload")

        })

        it("should return 400 when token structure is invalid", async () => {

            //GIVEN

            let user: User = {
                firstName: FIRSTNAME_EMPLOYEE,
                lastName: LASTNAME_EMPLOYEE,
                email: EMAIL_EMPLOYEE,
                password: PASSWORD_EMPLOYEE,
                role: EMPLOYEE_ROLE,
                isActive: true
            }

            await UserRepository.insert(user)

            const INVALID_TOKEN = "Bearer eyJhbGiwic2NvcGUiOiJNQU5BR0VSIiwiaxfQ.WBL-hHVw4gcrcUc2ZYIH3ukrUI-tu3e1yAfZRgQLtJU"

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/invite',
                headers: {
                    Authorization: INVALID_TOKEN
                },
                payload: {
                    email: EMAIL_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(responseParsed.statusCode).toBe(401)
            expect(responseParsed.message).toBe("Invalid token structure")

        })

        it("should return 400 when email is empty", async () => {

            //GIVEN
            const employee = await UserRepository.insert(EMPLOYEE_ACCOUNT);
            const EMAIL_EMPTY = ''
            const VALID_TOKEN = "Bearer "+generateHapiToken(employee)

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/invite',
                headers: {
                    Authorization: VALID_TOKEN
                },
                payload: {
                    email: EMAIL_EMPTY
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"email\" is not allowed to be empty")


        })

        it("should return 400 when email is missing", async () => {

            //GIVEN
            let employee = await UserRepository.insert(EMPLOYEE_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(employee);

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/invite',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"email\" is required")

        })

        it("should return 200 when /invite is successful ", async () => {

            //GIVEN
            let manager = await UserRepository.insert(MANAGER_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

            //WHEN
            const inviteResponse = await server.inject({
                method: "POST",
                url: '/invite',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                    email:EMAIL_EMPLOYEE
                }
            });

            //THEN
            expect(inviteResponse.statusCode).toBe(200)

         })

     })

    describe("Tests of /addemployee",()=> {

        it("should add user with success", async () => {
            //GIVEN
            let manager = await UserRepository.insert(MANAGER_ACCOUNT);

            const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

            let newEmployee: User = {
                firstName: "",
                lastName: "",
                email: EMPLOYEE_ACCOUNT.email,
                password: "",
                manager:EMAIL_MANAGER,
                role: EMPLOYEE_ROLE,
                pinCode:PINCODE,
                isActive: false
            }
            await UserRepository.insert(newEmployee);

            const response = await server.inject({
                method: "POST",
                url: '/addemployee',
                payload: {
                    email: EMPLOYEE_ACCOUNT.email,
                    pinCode:PINCODE,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE
                },
                headers:{Authorization: TOKEN_VALID}
            });

            let responseParsed = convertToObject(response.result);
            let artifacts = decodeHapiToken(responseParsed.payload.token);

            expect(response.statusCode).toBe(200)
            expect(responseParsed.payload.user.firstName).toEqual(FIRSTNAME_EMPLOYEE)
            expect(responseParsed.payload.user.lastName).toEqual(LASTNAME_EMPLOYEE)
            expect(responseParsed.payload.user.email).toEqual(EMAIL_EMPLOYEE)
            expect(responseParsed.payload.user.isActive).toBeTrue()
            expect(HapiJwt.token.signature.verify(artifacts.raw, 'HS256', TOKEN)).toBeTrue()


        });
        it("should return 400 when email is missing",async () => {

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addemployee',
                payload: {
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE,
                    pinCode: PINCODE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("\"email\" is required")

        })
        it("should return 400 when email is empty",async () => {
            //GIVEN
            const EMPTY_EMAIL= ""

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addemployee',
                payload: {
                    email:EMPTY_EMAIL,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE,
                    pinCode:PINCODE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "\"email\" is not allowed to be empty")

        })
        it("should return 400 when token is invalid", async () => {
            //GIVEN

            //WHEN


            //THEN

        })

    })

})


