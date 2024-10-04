import { JwtPayload } from "jwt-decode";

export enum AuthServiceProvider {
    AWS_COGNITO = "aws-cognito",
};

export type AuthState = "loading" | "authenticated" | "unauthenticated";

export enum Scopes {
    OID = 'openid',
    PROFILE = 'profile',
    EMAIL = 'email',
    SESSIONS_WRITE = 'flexisessions_db.write',
    SESSIONS_READ = 'flexisessions_db.read',
};

export const OIDC_SCOPES: readonly Scopes[] = [Scopes.EMAIL, Scopes.OID, Scopes.PROFILE];
export const DB_SCOPES: readonly Scopes[] = [Scopes.SESSIONS_READ, Scopes.SESSIONS_WRITE];
export const DEFAULT_SCOPES: readonly Scopes[] = [...DB_SCOPES];

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
    signIn: (userName: string, password: string, scopes?: Scopes[]) => Promise<IAuthResponse>;
    respondToChallenge: (r: IRespondToChallengeRequest) => Promise<IAuthResponse>;
    verify: (token: string) => Promise<JwtPayload>;
    forgotPassword: (userName: string) => Promise<boolean>;
    updateForgottenPassword: (userName: string, newPassword: string, verificationCode: string) => Promise<boolean>;
}