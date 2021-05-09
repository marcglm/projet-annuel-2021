import UserRepository from "../src/repository/UserRepository";
import {generateHapiToken} from "../src/security/tokenManagement";
import User from "../src/models/User";
import {convertToObject} from "../src/utils/conversion";
import {Server} from "@hapi/hapi";
import {init} from "../initServer";
import env from 'dotenv'
env.config()
const FAKER = require('faker')
const RANDOMSTRING = require("randomstring");

describe("Route tests ", ()=> {

    let server: Server;
    const PINCODE = RANDOMSTRING.generate({length: 10, charset: 'alphanumeric'});
    //ADMIN DATA
    const EMAIL_ADMIN = FAKER.internet.email();
    const PASSWORD_ADMIN = "Adminpassword6!"
    const NAME_ADMIN = FAKER.name.findName()
    const FIRSTNAME_ADMIN = NAME_ADMIN.split(" ")[0];
    const LASTNAME_ADMIN = NAME_ADMIN.split(" ")[1];
    const ROLE_ADMIN = 'ADMIN'

    let ADMIN_ACCOUNT:User = {
        email:EMAIL_ADMIN,
        password:PASSWORD_ADMIN,
        firstName:FIRSTNAME_ADMIN,
        lastName:LASTNAME_ADMIN,
        manager:"",
        scope:[ROLE_ADMIN],
        pinCode:PINCODE,
        isActive:true
    }

    //MANAGER DATA
    const EMAIL_MANAGER = FAKER.internet.email();
    const PASSWORD_MANAGER = "Managerpassword6!"
    const PASSWORD_MANAGER_2 = PASSWORD_MANAGER;
    const NAME_MANAGER = FAKER.name.findName()
    const FIRSTNAME_MANAGER = NAME_MANAGER.split(" ")[0];
    const LASTNAME_MANAGER = NAME_MANAGER.split(" ")[1];
    const MANAGER_ROLE = 'MANAGER'

    let MANAGER_ACCOUNT:User = {
        firstName: FIRSTNAME_MANAGER ,
        lastName: LASTNAME_MANAGER,
        email: EMAIL_MANAGER,
        password: PASSWORD_MANAGER,
        scope: [MANAGER_ROLE],
        pinCode:PINCODE,
        isActive: true
    }

    //EMPLOYEE DATA
    const EMAIL_EMPLOYEE = "marcghalem@hotmail.fr"
    const PASSWORD_EMPLOYEE = "Employeepaswword6!";
    const PASSWORD2 = PASSWORD_EMPLOYEE ;
    const NAME = FAKER.name.findName()
    const FIRSTNAME_EMPLOYEE = NAME.split(" ")[0];
    const LASTNAME_EMPLOYEE = NAME.split(" ")[1];
    const EMPLOYEE_ROLE = 'EMPLOYEE'

    let EMPLOYEE_ACCOUNT: User = {
        firstName: FIRSTNAME_EMPLOYEE,
        lastName: LASTNAME_EMPLOYEE,
        email: EMAIL_EMPLOYEE,
        password: PASSWORD_EMPLOYEE,
        scope:[EMPLOYEE_ROLE],
        pinCode:PINCODE,
        isActive: true
    }

    const TOKEN = process.env.TOKEN;

    beforeAll(async () => {
        server = await init()
    })
    afterAll(async () => {

        await server.stop()
    })

    beforeEach(async () => {
        await UserRepository.delete(MANAGER_ACCOUNT.email)
        await UserRepository.delete(EMPLOYEE_ACCOUNT.email)
        await UserRepository.delete(ADMIN_ACCOUNT.email)

    })
    afterEach(async () => {
        await UserRepository.delete(MANAGER_ACCOUNT.email)
        await UserRepository.delete(EMPLOYEE_ACCOUNT.email)
        await UserRepository.delete(ADMIN_ACCOUNT.email)

    })

    describe("Tests of /addemployee",async ()=>{

        describe("Empty field",()=> {
            it("should return 400 when email is empty",async () => {
                //GIVEN
                const EMPTY_EMAIL= ""
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

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
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"email\" is not allowed to be empty")

            })
            it("should return 400 when password is empty",async () => {
                //GIVEN
                const EMPTY_PASSWORD= ""
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_EMPLOYEE,
                        password: EMPTY_PASSWORD,
                        password2: PASSWORD2,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"password\" is not allowed to be empty")

            })
            it("should return 400 when password2 is empty",async () => {
                //GIVEN
                const EMPTY_PASSWORD= ""
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_EMPLOYEE,
                        password: PASSWORD_EMPLOYEE,
                        password2: EMPTY_PASSWORD,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"password2\" must be [ref:password]")

            })
            it("should return 400 when firstname is empty",async () => {
                //GIVEN
                const EMPTY_FIRSTNAME= ""
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_EMPLOYEE,
                        password: PASSWORD_EMPLOYEE,
                        password2: PASSWORD2,
                        firstName: EMPTY_FIRSTNAME,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"firstName\" is not allowed to be empty")

            })
            it("should return 400 when lastname is empty",async () => {
                //GIVEN
                const EMPTY_LASTNAME= ""
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_EMPLOYEE,
                        password: PASSWORD_EMPLOYEE,
                        password2: PASSWORD2,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: EMPTY_LASTNAME,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"lastName\" is not allowed to be empty")

            })
            it("should return 400 when pinCode is empty",async () => {
                //GIVEN
                const PINCODE_EMPTY= ""
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_EMPLOYEE,
                        password: PASSWORD_EMPLOYEE,
                        password2: PASSWORD2,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE_EMPTY
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"pinCode\" is not allowed to be empty")

            })
        })

        describe("Missing field",()=> {
            it("should return 400 when email is missing",async () => {
                //GIVEN
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        password: PASSWORD_EMPLOYEE,
                        password2: PASSWORD2,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode: PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"email\" is required")

            })
            it("should return 400 when password is missing",async () => {
                //GIVEN
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email: EMPLOYEE_ACCOUNT.email,
                        password2: PASSWORD2,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode: PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" is required")

            })
            it("should return 400 when password2 is missing",async () => {
                //GIVEN
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email: EMPLOYEE_ACCOUNT.email,
                        password: PASSWORD_EMPLOYEE,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode: PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password2\" is required")

            })
            it("should return 400 when firstname is missing",async () => {
                //GIVEN
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_EMPLOYEE,
                        password: PASSWORD_EMPLOYEE,
                        password2: PASSWORD2,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode: PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"firstName\" is required")

            })
            it("should return 400 when lastname is missing",async () => {
                //GIVEN
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_EMPLOYEE,
                        password: PASSWORD_EMPLOYEE,
                        password2: PASSWORD2,
                        firstName:FIRSTNAME_EMPLOYEE,
                        pinCode: PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"lastName\" is required")

            })
            it("should return 400 when pinCode is missing",async () => {
                //GIVEN
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_EMPLOYEE,
                        password2: PASSWORD2,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName:LASTNAME_EMPLOYEE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"pinCode\" is required")

            })
        })

        describe("Password related",()=>{
            it("should return 400 when password2 and password are not identical",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "Invalidpassword6!" ;
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);


                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_EMPLOYEE,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password2\" must be [ref:password]")
            })
            it("should return 400 when password length < 6 ",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "Wrd6!" ;
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                let employee :User = {
                    email:EMAIL_EMPLOYEE,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_EMPLOYEE,
                    scope:[EMPLOYEE_ROLE],
                    pinCode:PINCODE,
                    isActive:false
                }
                await UserRepository.insert(employee);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should be at least 6 characters long")
            })
            it("should return 400 when password length > 20 ",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "PasswordWithTooMuchChar6!" ;
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                let employee :User = {
                    email:EMAIL_EMPLOYEE,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_EMPLOYEE,
                    scope:[EMPLOYEE_ROLE],
                    pinCode:PINCODE,
                    isActive:false
                }
                await UserRepository.insert(employee);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should not be longer than 20 characters")
            })
            it("should return 400 when password don't have at least one lowercase ",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "PASSWORD_UPPERCASE6!" ;
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                let employee :User = {
                    email:EMAIL_EMPLOYEE,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_ADMIN,
                    scope:[MANAGER_ROLE],
                    pinCode:PINCODE,
                    isActive:false
                }
                await UserRepository.insert(employee);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 lower-cased letter")
            })
            it("should return 400 when password don't have at least one uppercase ",async () =>{

                //GIVEN
                const PASSWORD_INVALID = "lowercase6!" ;
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                let employee :User = {
                    email:EMAIL_EMPLOYEE,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_EMPLOYEE,
                    scope:[EMPLOYEE_ROLE],
                    isActive:false,
                    pinCode:PINCODE
                }
                await UserRepository.insert(employee);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 upper-cased letter")
            })
            it("should return 400 when password don't have at least one digit ",async () =>{

                //GIVEN
                const PASSWORD_INVALID = "Password!" ;
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                let employee :User = {
                    email:EMAIL_EMPLOYEE,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_EMPLOYEE,
                    scope:[EMPLOYEE_ROLE],
                    isActive:false,
                    pinCode:PINCODE
                }
                await UserRepository.insert(employee);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 number")
            })
            it("should return 400 when password don't have at least one symbol ",async () =>{

                //GIVEN
                const PASSWORD_INVALID = "Password6" ;
                let manager = await UserRepository.insert(MANAGER_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
                let employee :User = {
                    email:EMAIL_EMPLOYEE,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_EMPLOYEE,
                    scope:[EMPLOYEE_ROLE],
                    isActive:false,
                    pinCode:PINCODE
                }
                await UserRepository.insert(employee);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addemployee',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_EMPLOYEE,
                        lastName: LASTNAME_EMPLOYEE,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 symbol")
            })
        })

        it("should return 400 when pinCode is wrong",async()=>{
            //GIVEN
            const WRONG_PINCODE = "wrongPinCode" ;
            let manager = await UserRepository.insert(MANAGER_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
            let employee :User = {
                email:EMAIL_EMPLOYEE,
                password:"",
                firstName:"",
                lastName:"",
                manager:"",
                scope:[EMPLOYEE_ROLE],
                isActive:false,
                pinCode:PINCODE
            }
            await UserRepository.insert(employee);

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addemployee',
                payload: {
                    email: EMAIL_EMPLOYEE,
                    password: PASSWORD_EMPLOYEE,
                    password2: PASSWORD2,
                    firstName: FIRSTNAME_EMPLOYEE,
                    lastName: LASTNAME_EMPLOYEE,
                    pinCode:WRONG_PINCODE
                },
                headers: {Authorization: TOKEN_VALID}
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("Pin code invalid !")

        })

        it("should return 400 when email field is not valid", async () => {
            //GIVEN
            const EMAIL_NOT_VALID = "notvalid@.fr"
            let manager = await UserRepository.insert(MANAGER_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addemployee',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                    email:EMAIL_NOT_VALID,
                    password:PASSWORD_EMPLOYEE,
                    password2:PASSWORD2,
                    firstName:FIRSTNAME_EMPLOYEE,
                    lastName:LASTNAME_EMPLOYEE,
                    pinCode:PINCODE
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
            let manager = await UserRepository.insert(MANAGER_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addemployee',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                    email:EMAIL_NON_EXISTENT,
                    password:PASSWORD_EMPLOYEE,
                    password2:PASSWORD2,
                    firstName:FIRSTNAME_EMPLOYEE,
                    lastName:LASTNAME_EMPLOYEE,
                    pinCode:PINCODE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "Your manager must send you an invitation link first !")
        })


    })

    describe("Test of /addmanager", async () => {

        it("should add a manager successfully", async ()=>{
            //GIVEN
            let admin = await UserRepository.insert(ADMIN_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

            let manager:User = {
                firstName: "" ,
                lastName: "" ,
                email: EMAIL_MANAGER,
                password: "",
                scope: [MANAGER_ROLE],
                pinCode:PINCODE,
                isActive: false
            }
            await UserRepository.insert(manager);

            //WHEN
            const addManagerResponse = await server.inject({
                method: "POST",
                url: '/addmanager',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                    email:EMAIL_MANAGER,
                    password:PASSWORD_MANAGER,
                    password2:PASSWORD_MANAGER_2,
                    firstName:FIRSTNAME_MANAGER,
                    lastName:LASTNAME_MANAGER,
                    pinCode:PINCODE
                }
            });

            //THEN
            let responseParsed = convertToObject(addManagerResponse.result);

            expect(addManagerResponse.statusCode).toBe(200)
            expect(responseParsed.payload.user.firstName).toEqual(FIRSTNAME_MANAGER)
            expect(responseParsed.payload.user.lastName).toEqual(LASTNAME_MANAGER)
            expect(responseParsed.payload.user.email).toEqual(EMAIL_MANAGER)
            expect(responseParsed.payload.user.isActive).toBeTrue()
        })

        /*   describe("Token related",()=> {
               it("should return 401 when token is invalid", async () => {
                   //GIVEN
                   const INVALID_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VuIjoiNjA4ODNkZjc5ZmUxZjEyMGM0MmY4MDBjIiwic2NvcGUiOiJNQU5BR0VSIiwiaxfQ.WBL-hHVw4gcrcUc2ZYIH3ukrUI-tu3e1yAfZRgQLtJU"

                   //WHEN
                   const response = await server.inject({
                       method: "POST",
                       url: '/addmanager',
                       headers: {
                           Authorization: INVALID_TOKEN
                       },
                       payload: {
                           email:EMAIL_MANAGER,
                           password:PASSWORD_MANAGER,
                           password2:PASSWORD_MANAGER_2,
                           firstName:FIRSTNAME_MANAGER,
                           lastName:LASTNAME_MANAGER,
                           pinCode:PINCODE
                       }
                   });

                   //THEN
                   let responseParsed = convertToObject(response.result);
                   expect(responseParsed.statusCode).toBe(401)
                   expect(responseParsed.message).toBe("Invalid token payload")

               })

               it("should return 400 when token structure is invalid", async () => {

                   //GIVEN
                   const INVALID_TOKEN = "Bearer eyJhbGiwic2NvcGUiOiJNQU5BR0VSIiwiaxfQ.WBL-hHVw4gcrcUc2ZYIH3ukrUI-tu3e1yAfZRgQLtJU"

                   //WHEN
                   const response = await server.inject({
                       method: "POST",
                       url: '/addmanager',
                       headers: {
                           Authorization: INVALID_TOKEN
                       },
                       payload: {
                           email:EMAIL_MANAGER,
                           password:PASSWORD_MANAGER,
                           password2:PASSWORD_MANAGER_2,
                           firstName:FIRSTNAME_MANAGER,
                           lastName:LASTNAME_MANAGER,
                           pinCode:PINCODE
                       }
                   });

                   //THEN
                   let responseParsed = convertToObject(response.result);
                   expect(responseParsed.statusCode).toBe(401)
                   expect(responseParsed.message).toBe("Invalid token structure")

               })

               it("should return 401 when token is missing", async () => {
                   //WHEN
                   const response = await server.inject({
                       method: "POST",
                       url: '/addmanager',
                       payload: {
                           email:EMAIL_MANAGER,
                           password:PASSWORD_MANAGER,
                           password2:PASSWORD_MANAGER_2,
                           firstName:FIRSTNAME_MANAGER,
                           lastName:LASTNAME_MANAGER,
                           pinCode:PINCODE
                       }

                   });

                   //THEN
                   let responseParsed = convertToObject(response.result);
                   expect(responseParsed.statusCode).toBe(401)
                   expect(responseParsed.message).toBe("Missing authentication")

               })

               it("should return 401 when token is empty", async () => {
                   //GIVEN
                   const EMPTY_TOKEN = ""

                   //WHEN
                   const response = await server.inject({
                       method: "POST",
                       url: '/addmanager',
                       headers: {
                           Authorization: EMPTY_TOKEN
                       },
                       payload: {
                           email:EMAIL_MANAGER,
                           password:PASSWORD_MANAGER,
                           password2:PASSWORD_MANAGER_2,
                           firstName:FIRSTNAME_MANAGER,
                           lastName:LASTNAME_MANAGER,
                           pinCode:PINCODE
                       }
                   });

                   //THEN
                   let responseParsed = convertToObject(response.result);
                   expect(responseParsed.statusCode).toBe(401)
                   expect(responseParsed.message).toBe("Missing authentication")

               })

           })  */

        describe("Empty field", async () => {
            it("should return 400 when email is empty",async () => {
                //GIVEN
                const EMPTY_EMAIL= ""
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const addManagerResponse = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMPTY_EMAIL,
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(addManagerResponse.result);
                expect(addManagerResponse.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"email\" is not allowed to be empty")

            })
            it("should return 400 when password is empty",async () => {
                //GIVEN
                const EMPTY_PASSWORD= ""
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: EMPTY_PASSWORD,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"password\" is not allowed to be empty")

            })
            it("should return 400 when password2 is empty",async () => {
                //GIVEN
                const EMPTY_PASSWORD= ""
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        password2: EMPTY_PASSWORD,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"password2\" must be [ref:password]")

            })
            it("should return 400 when firstname is empty",async () => {
                //GIVEN
                const EMPTY_FIRSTNAME= ""
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: EMPTY_FIRSTNAME,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"firstName\" is not allowed to be empty")

            })
            it("should return 400 when lastname is empty",async () => {
                //GIVEN
                const EMPTY_LASTNAME= ""
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: EMPTY_LASTNAME,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"lastName\" is not allowed to be empty")

            })
            it("should return 400 when pinCode is empty",async () => {
                //GIVEN
                const PINCODE_EMPTY= ""
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE_EMPTY
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe( "\"pinCode\" is not allowed to be empty")

            })

        })

        describe("Missing field",()=> {
            it("should return 400 when email is missing",async () => {
                //GIVEN
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"email\" is required")

            })
            it("should return 400 when password is missing",async () => {
                //GIVEN
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" is required")

            })
            it("should return 400 when password2 is missing",async () => {
                //GIVEN
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password2\" is required")

            })
            it("should return 400 when firstname is missing",async () => {
                //GIVEN
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"firstName\" is required")

            })
            it("should return 400 when lastname is missing",async () => {
                //GIVEN
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        pinCode:PINCODE
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"lastName\" is required")

            })
            it("should return 400 when pinCode is missing",async () => {
                //GIVEN
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                //WHEN
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    payload: {
                        email:EMAIL_MANAGER,
                        password: PASSWORD_MANAGER,
                        password2: PASSWORD_MANAGER_2,
                        firstName: FIRSTNAME_MANAGER,
                        lastName:LASTNAME_MANAGER
                    },
                    headers: {Authorization: TOKEN_VALID}
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"pinCode\" is required")

            })

        })

        describe("Password related",()=>{
            it("should return 400 when password2 and password are not identical",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "Invalidpassword6!" ;
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);


                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_MANAGER,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_MANAGER,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password2\" must be [ref:password]")
            })
            it("should return 400 when password length < 6 ",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "Wrd6!" ;
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);

                let manager :User = {
                    email:EMAIL_MANAGER,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_ADMIN,
                    scope:[MANAGER_ROLE],
                    pinCode:PINCODE,
                    isActive:false
                }
                await UserRepository.insert(manager);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_MANAGER,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should be at least 6 characters long")
            })
            it("should return 400 when password length > 20 ",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "PasswordWithTooMuchChar6!" ;
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                let manager :User = {
                    email:EMAIL_MANAGER,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_ADMIN,
                    scope:[MANAGER_ROLE],
                    pinCode:PINCODE,
                    isActive:false
                }
                await UserRepository.insert(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_MANAGER,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should not be longer than 20 characters")
            })
            it("should return 400 when password don't have at least one lowercase ",async () =>{
                //GIVEN
                const PASSWORD_INVALID = "PASSWORD_UPPERCASE6!" ;
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                let manager :User = {
                    email:EMAIL_MANAGER,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_ADMIN,
                    scope:[MANAGER_ROLE],
                    pinCode:PINCODE,
                    isActive:false
                }
                await UserRepository.insert(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_MANAGER,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 lower-cased letter")
            })
            it("should return 400 when password don't have at least one uppercase ",async () =>{

                //GIVEN
                const PASSWORD_INVALID = "lowercase6!" ;
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                let manager :User = {
                    email:EMAIL_MANAGER,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_ADMIN,
                    scope:[MANAGER_ROLE],
                    isActive:false,
                    pinCode:PINCODE
                }
                await UserRepository.insert(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_MANAGER,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 upper-cased letter")
            })
            it("should return 400 when password don't have at least one digit ",async () =>{

                //GIVEN
                const PASSWORD_INVALID = "Password!" ;
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                let manager :User = {
                    email:EMAIL_MANAGER,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_ADMIN,
                    scope:[MANAGER_ROLE],
                    isActive:false,
                    pinCode:PINCODE
                }
                await UserRepository.insert(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_MANAGER,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 number")
            })
            it("should return 400 when password don't have at least one symbol ",async () =>{

                //GIVEN
                const PASSWORD_INVALID = "Password6" ;
                let admin = await UserRepository.insert(ADMIN_ACCOUNT);
                const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
                let manager :User = {
                    email:EMAIL_MANAGER,
                    password:"",
                    firstName:"",
                    lastName:"",
                    manager:EMAIL_ADMIN,
                    scope:[MANAGER_ROLE],
                    isActive:false,
                    pinCode:PINCODE
                }
                await UserRepository.insert(manager);

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/addmanager',
                    headers: {
                        Authorization: TOKEN_VALID
                    },
                    payload: {
                        email: EMAIL_MANAGER,
                        password: PASSWORD_INVALID,
                        password2: PASSWORD_INVALID,
                        firstName: FIRSTNAME_MANAGER,
                        lastName: LASTNAME_MANAGER,
                        pinCode:PINCODE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(response.statusCode).toBe(400)
                expect(responseParsed.code).toBe(1)
                expect(responseParsed.msg).toBe("\"password\" should contain at least 1 symbol")
            })
        })

        it("should return 400 when pinCode is wrong",async()=>{
            //GIVEN
            const WRONG_PINCODE = "wrongPinCode" ;
            let admin = await UserRepository.insert(ADMIN_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(admin);
            let manager :User = {
                email:EMAIL_MANAGER,
                password:"",
                firstName:"",
                lastName:"",
                manager:"",
                scope:[MANAGER_ROLE],
                isActive:false,
                pinCode:PINCODE
            }
            await UserRepository.insert(manager);

            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addmanager',
                payload: {
                    email: EMAIL_MANAGER,
                    password: PASSWORD_MANAGER,
                    password2: PASSWORD_MANAGER_2,
                    firstName: FIRSTNAME_MANAGER,
                    lastName: LASTNAME_MANAGER,
                    pinCode:WRONG_PINCODE
                },
                headers: {Authorization: TOKEN_VALID}
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe("Pin code invalid !")

        })

        it("should return 400 when email field is not valid", async () => {
            //GIVEN
            const EMAIL_NOT_VALID = "notvalid@.fr"
            let admin = await UserRepository.insert(ADMIN_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(admin);



            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addmanager',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                    email:EMAIL_NOT_VALID,
                    password:PASSWORD_MANAGER,
                    password2:PASSWORD_MANAGER_2,
                    firstName:FIRSTNAME_MANAGER,
                    lastName:LASTNAME_MANAGER,
                    pinCode:PINCODE
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
            let admin = await UserRepository.insert(ADMIN_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(admin);


            //WHEN
            const response = await server.inject({
                method: "POST",
                url: '/addmanager',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                    email:EMAIL_NON_EXISTENT,
                    password:PASSWORD_MANAGER,
                    password2:PASSWORD_MANAGER_2,
                    firstName:FIRSTNAME_MANAGER,
                    lastName:LASTNAME_MANAGER,
                    pinCode:PINCODE
                }
            });

            //THEN
            let responseParsed = convertToObject(response.result);
            expect(response.statusCode).toBe(400)
            expect(responseParsed.code).toBe(1)
            expect(responseParsed.msg).toBe( "The administrator must send you an invitation link first !")
        })

    })

    it("should return 400 when password2 and password are not identical",async () => {

        //GIVEN
        const PASSWORD2_INVALID = "invalidpassword" ;
        let manager = await UserRepository.insert(MANAGER_ACCOUNT);
        const TOKEN_VALID = "Bearer "+generateHapiToken(manager);


        //WHEN
        const response = await server.inject({
            method: "POST",
            url: '/addemployee',
            payload: {
                email: EMAIL_EMPLOYEE,
                password: PASSWORD_EMPLOYEE,
                password2: PASSWORD2_INVALID,
                firstName: FIRSTNAME_EMPLOYEE,
                lastName: LASTNAME_EMPLOYEE,
                pinCode:PINCODE
            },
            headers: {Authorization: TOKEN_VALID}
        });

        //THEN
        let responseParsed = convertToObject(response.result);
        expect(response.statusCode).toBe(400)
        expect(responseParsed.code).toBe(1)
        expect(responseParsed.msg).toBe("\"password2\" must be [ref:password]")
    })
    it("should return 400 when pinCode is wrong",async()=>{
        //GIVEN
        const WRONG_PINCODE = "wrongPinCode" ;
        let manager = await UserRepository.insert(MANAGER_ACCOUNT);
        const TOKEN_VALID = "Bearer "+generateHapiToken(manager);


        //WHEN
        const response = await server.inject({
            method: "POST",
            url: '/addemployee',
            payload: {
                email: EMAIL_EMPLOYEE,
                password: PASSWORD_EMPLOYEE,
                password2: PASSWORD2,
                firstName: FIRSTNAME_EMPLOYEE,
                lastName: LASTNAME_EMPLOYEE,
                pinCode:WRONG_PINCODE
            },
            headers: {Authorization: TOKEN_VALID}
        });

        //THEN
        let responseParsed = convertToObject(response.result);
        expect(response.statusCode).toBe(400)
        expect(responseParsed.code).toBe(1)
        expect(responseParsed.msg).toBe("Your manager must send you an invitation link first !")

    })
    it("should return 400 when email contains only space",async () => {
        //GIVEN
        let manager = await UserRepository.insert(MANAGER_ACCOUNT);
        let EMAIL_WITH_ONLY_SPACE = "      ";

        //WHEN
        const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
        const response = await server.inject({
            method: "POST",
            url: '/addemployee',
            payload: {
                email:EMAIL_WITH_ONLY_SPACE,
                password: PASSWORD_EMPLOYEE,
                password2: PASSWORD2,
                firstName:FIRSTNAME_EMPLOYEE,
                pinCode: PINCODE
            },
            headers: {Authorization: TOKEN_VALID}
        });

        //THEN
        let responseParsed = convertToObject(response.result);
        expect(response.statusCode).toBe(400)
        expect(responseParsed.code).toBe(1)
        expect(responseParsed.msg).toBe('\"email\" must be a valid email')

    })

    describe("Tests of /signin of empty field",async ()=> {

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

    describe("Tests of /signin of missing field",async ()=> {
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
        expect(responseParsed.msg).toBe( "No such User !")
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


    describe("Tests of /invite",async ()=> {

        describe("Token related",()=> {
            it("should return 401 when token is invalid", async () => {
                //GIVEN
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
            it("should return 401 when token is missing", async () => {
                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/invite',
                    payload: {
                        email: EMAIL_EMPLOYEE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(responseParsed.statusCode).toBe(401)
                expect(responseParsed.message).toBe("Missing authentication")

            })
            it("should return 401 when token is empty", async () => {
                //GIVEN
                const EMPTY_TOKEN = ""

                //WHEN
                const response = await server.inject({
                    method: "POST",
                    url: '/invite',
                    headers: {
                        Authorization: EMPTY_TOKEN
                    },
                    payload: {
                        email: EMAIL_EMPLOYEE
                    }
                });

                //THEN
                let responseParsed = convertToObject(response.result);
                expect(responseParsed.statusCode).toBe(401)
                expect(responseParsed.message).toBe("Missing authentication")

            })

        })


        it("should return 400 when email is empty", async () => {

            //GIVEN
            const manager = await UserRepository.insert(MANAGER_ACCOUNT);
            const EMAIL_EMPTY = ''
            const VALID_TOKEN = "Bearer "+generateHapiToken(manager)

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
            let manager = await UserRepository.insert(MANAGER_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(manager);

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

        it("should return 403 when /invite is used with an employee's token ", async () => {

            //GIVEN
            let employee = await UserRepository.insert(EMPLOYEE_ACCOUNT);
            const TOKEN_VALID_EMPLOYEE = "Bearer "+generateHapiToken(employee);

            //WHEN
            const inviteResponse = await server.inject({
                method: "POST",
                url: '/invite',
                headers: {
                    Authorization: TOKEN_VALID_EMPLOYEE
                },
                payload: {
                    email:EMAIL_EMPLOYEE
                }
            });

            //THEN
            let responseParsed = convertToObject(inviteResponse.result);
            expect(responseParsed.message).toBe("Insufficient scope")
            expect(inviteResponse.statusCode).toBe(403)

        })

        it("should return 200 when /invite for an employee is successful ", async () => {

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

        it("should return 200 when /invite for a manager is successful ", async () => {

            //GIVEN
            let admin = await UserRepository.insert(ADMIN_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(admin);

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


        it("should return 400 when email's format is wrong ", async () => {

            //GIVEN
            let manager = await UserRepository.insert(MANAGER_ACCOUNT);
            const TOKEN_VALID = "Bearer "+generateHapiToken(manager);
            const EMAIL_WRONG_FORMAT = "testmail.fr"

            //WHEN
            const inviteResponse = await server.inject({
                method: "POST",
                url: '/invite',
                headers: {
                    Authorization: TOKEN_VALID
                },
                payload: {
                    email:EMAIL_WRONG_FORMAT
                }
            });

            //THEN
            let responseParsed = convertToObject(inviteResponse.result);

            expect(inviteResponse.statusCode).toBe(400)
            expect(responseParsed.msg).toBe("\"email\" must be a valid email")


        })

    })


})



