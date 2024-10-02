import config from "../../config.json";
import { AuthServiceProvider, IAuthService, isServiceProvider } from "../../models/Auth";
import CognitoAuthService from "./CognitoAuthService";

function newAuthServiceProvider(sp: AuthServiceProvider): IAuthService {
    switch (sp) {
        case AuthServiceProvider.AWS_COGNITO:
            return new CognitoAuthService();
        default: throw new Error('Unsupported service provider');
    }
}

function getServiceProviderFromConfig(): IAuthService{
    const cfgKeys = Object.keys(config);
    for(const k of cfgKeys) {
        if(isServiceProvider(k)) {
            return newAuthServiceProvider(k as AuthServiceProvider);
        }
    }
    throw new Error('No service provider found');
}

class AuthService {
    static #instance: IAuthService;
    private constructor(){}

    public static get instance(): IAuthService {
        if(!AuthService.#instance){
            AuthService.#instance = getServiceProviderFromConfig();
        }
        return AuthService.#instance;
    }
}

export default AuthService.instance;