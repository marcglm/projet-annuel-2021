export class UserNotFoundError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "UserNotFoundError";
    }
}

export class UserPasswordWrongError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "UserNotFoundError";
    }
}

export class UserRequiredCredentialsError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "UserRequiredCredentialsError";
    }
}

export class UserAlreadyExistedError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "UserAlreadyExistedError";
    }
}