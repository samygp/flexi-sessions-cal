import { JwtPayload } from "jwt-decode";

export enum AuthServiceProvider {
    AWS_COGNITO = "aws-cognito",
};

const serviceProviderSet = new Set<string>(Object.values(AuthServiceProvider));
export const isServiceProvider = (k: string) => serviceProviderSet.has(k);

export type AuthServiceProviderConfig = Record<AuthServiceProvider, Record<string, any>>;

export interface IOAuthTokens {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
}

export interface IAuthResponse {
    tokens?: IOAuthTokens;
    session?: string;
    requiresChallenge?: string;
}

export interface IRespondToChallengeRequest {
    challengeType: string;
    values: Record<string, any>;
}

export interface IAuthService {
    signIn: (userName: string, password: string) => Promise<IAuthResponse>;
    respondToChallenge: (r: IRespondToChallengeRequest) => Promise<IAuthResponse>;
    verify: (token: string) => Promise<JwtPayload>;
}