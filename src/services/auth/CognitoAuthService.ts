import { AuthenticationResultType, AuthFlowType, ChallengeNameType, CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandInput, InitiateAuthCommandOutput, RespondToAuthChallengeCommand, RespondToAuthChallengeCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import config from "../../config.json";
import { IAuthResponse, IOAuthTokens, IRespondToChallengeRequest } from "../../models/Auth";
import { CognitoJwtVerifier } from "aws-jwt-verify";

interface ICognitoConfig {
  userPoolId: string,
  clientId: string,
  region: string,
};

const _COGNITO_CONFIG:ICognitoConfig = config['aws-cognito'];

const tokensFromResult = (result?: AuthenticationResultType): IOAuthTokens|undefined => {
  if(!result) return;
  return {
    accessToken: result.AccessToken ?? '',
    refreshToken: result.RefreshToken ?? '',
    idToken: result.IdToken ?? '',
  }
}

function formatCognitoResponse<T extends InitiateAuthCommandOutput>({AuthenticationResult, ChallengeName, Session}: T): IAuthResponse {
  return {
    tokens: tokensFromResult(AuthenticationResult),
    requiresChallenge: ChallengeName,
    session: Session,      
  };
}

export default class CognitoAuthService {
  private static cognitoClient = new CognitoIdentityProviderClient(_COGNITO_CONFIG);
  private static verifier = CognitoJwtVerifier.create({ ..._COGNITO_CONFIG, tokenUse: "access" })

  public verify = async (token: string) => {
    return CognitoAuthService.verifier.verify(token);
  }

  public signIn = async (userName: string, password: string): Promise<IAuthResponse> => {
    const params: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: _COGNITO_CONFIG.clientId,
      AuthParameters: {
        USERNAME: userName,
        PASSWORD: password,
      },
    };
    try {
      const command = new InitiateAuthCommand(params);
      return formatCognitoResponse(await CognitoAuthService.cognitoClient.send(command));    
    } catch (error) {
      console.error("Error signing in: ", error);
      throw error;
    }
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
    try {
      const command = new RespondToAuthChallengeCommand(params);
      return formatCognitoResponse(await CognitoAuthService.cognitoClient.send(command));
    } catch (error) {
      console.error("Error signing in: ", error);
      throw error;
    }
  }

  public respondToChallenge = async ({challengeType, values}: IRespondToChallengeRequest) => {
    if(challengeType === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      const {userName, newPassword, session} = values;
      return await this.updatePasswordChallenge(userName, newPassword, session);
    }
    throw new Error(`Challenge type ${challengeType} not supported`);
  }
}