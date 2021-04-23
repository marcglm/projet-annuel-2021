import TeamRepository from "../../repository/TeamRepository";
import {convertToObject, initTeamObject} from "../../utils/Convertion";
import {Request} from "@hapi/hapi";
import {UserAlreadyExistedError} from "../../Errors/UserError";

export const sendInvitationLink = async (request:Request) => {
    let emailObject = await convertToObject(request.payload);
    const team = await TeamRepository.findByEmailManager(emailObject.emailManager);

    if (!team) throw new UserAlreadyExistedError("Team doesn't exist ");

    return TeamRepository.update(emailObject.emailManager,emailObject.emailEmployee);
}

export const addManager = async (request:Request):Promise<any> => {
    let manager = await initTeamObject(request.payload);

    const isEmailManagerExist = await TeamRepository.findByEmailManager(manager.emailManager);
    if (isEmailManagerExist) throw new UserAlreadyExistedError("Email's manager already exist");

    return await TeamRepository.insertManager(manager);
    //return TeamRepository.update(emailObject.emailManager,emailObject.emailEmployee);
}

export const addEmployee = async (request:Request) => {

}
