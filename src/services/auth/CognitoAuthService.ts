import {
  AuthenticationResultType,
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
  ForgotPasswordCommand,
  ForgotPasswordCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import config from "../../config.json";
import { IOAuthTokens, Scopes, DEFAULT_SCOPES, IAuthResponse, IRespondToChallengeRequest } from "../../shared/models/Auth";

import { CognitoJwtVerifier } from "aws-jwt-verify";

interface ICognitoConfig {
  userPoolId: string,
  clientId: string,
  region: string,
};

const _COGNITO_CONFIG: ICognitoConfig = config['aws-cognito'];

const tokensFromResult = (result?: AuthenticationResultType): IOAuthTokens | undefined => {
  if (!result) return;
  return {
    accessToken: result.AccessToken ?? '',
    refreshToken: result.RefreshToken ?? '',
    idToken: result.IdToken ?? '',
  }
}

function formatCognitoResponse<T extends InitiateAuthCommandOutput>({ AuthenticationResult, ChallengeName, Session }: T): IAuthResponse {
  return {
    tokens: tokensFromResult(AuthenticationResult),
    requiresChallenge: ChallengeName,
    session: Session,
  };
}

type SupportedCognitoCommand = InitiateAuthCommand | ForgotPasswordCommand | RespondToAuthChallengeCommand | ConfirmForgotPasswordCommand;

export default class CognitoAuthService {
  private static cognitoClient = new CognitoIdentityProviderClient(_COGNITO_CONFIG);
  private static verifier = CognitoJwtVerifier.create({ ..._COGNITO_CONFIG, tokenUse: "access" });

  public verify = async (token: string) => {
    return CognitoAuthService.verifier.verify(token);
  }

  private async sendCommand<T>(command: SupportedCognitoCommand, callback?: (response: any) => T): Promise<T> {
    try {
      const response = await CognitoAuthService.cognitoClient.send(command as any);
      return callback ? callback(response) : response as T;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public signIn = async (userName: string, password: string, scopes?: Scopes[]): Promise<IAuthResponse> => {
    const params: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: _COGNITO_CONFIG.clientId,
      AuthParameters: {
        USERNAME: userName,
        PASSWORD: password,
        SCOPE: scopes?.join(' ') ?? DEFAULT_SCOPES.join(' '),
      },
    };
    return this.sendCommand(new InitiateAuthCommand(params), formatCognitoResponse);
  };

  private updatePasswordChallenge = async (userName: string, newPassword: string, session: string): Promise<IAuthResponse> => {
    const params: RespondToAuthChallengeCommandInput = {
      ClientId: _COGNITO_CONFIG.clientId,
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ChallengeResponses: {
        USERNAME: userName,
        NEW_PASSWORD: newPassword,
      },
      Session: session,
    };
    return this.sendCommand(new RespondToAuthChallengeCommand(params), formatCognitoResponse);
  }

  public respondToChallenge = async ({ challengeType, values }: IRespondToChallengeRequest): Promise<IAuthResponse> => {
    if (challengeType === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      const { userName, newPassword, session } = values;
      return this.updatePasswordChallenge(userName, newPassword, session);
    }
    throw new Error(`Challenge type ${challengeType} not supported`);
  }

  public forgotPassword = async (userName: string): Promise<boolean> => {
    const params: ForgotPasswordCommandInput = {
      ClientId: _COGNITO_CONFIG.clientId,
      Username: userName,
    };
    await this.sendCommand(new ForgotPasswordCommand(params));
    return true;
  }

  public updateForgottenPassword = async (userName: string, newPassword: string, code: string): Promise<boolean> => {
    const params: ConfirmForgotPasswordCommandInput = {
      ClientId: _COGNITO_CONFIG.clientId,
      Username: userName,
      ConfirmationCode: code,
      Password: newPassword,
    };
    await this.sendCommand(new ConfirmForgotPasswordCommand(params));
    return true;
  }
}