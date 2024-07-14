import { AuthFlowType, CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import cfg from "../config.json";

export const cognitoClient = new CognitoIdentityProviderClient({ region: cfg.region });

export const signIn = async (username: string, password: string) => {
  const params: InitiateAuthCommandInput = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: cfg.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await cognitoClient.send(command);
    if (AuthenticationResult) {
      return AuthenticationResult;
    }
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};