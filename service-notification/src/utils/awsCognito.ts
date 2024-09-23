import {
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminGetUserCommandInput,
  AdminGetUserCommandOutput,
  AttributeType,
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommandInput,
  ForgotPasswordCommandOutput,
  GetUserCommand,
  GetUserCommandOutput,
  ResendConfirmationCodeCommandInput,
  ResendConfirmationCodeCommandOutput,
  SignUpCommandInput,
  SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import { cognito } from "../config";
import {
  InputAuthLoginInterface,
  InputConfirmForgotPasswordInterface,
  InputConfirmSignUpInterface,
  InputResendConfirmationCodeInterface,
  InputUserInterface,
} from "../interfaces";

class AwsCognito {
  private static instance: AwsCognito;
  private cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  private cognitoIdentityProvider: CognitoIdentityProvider;

  private constructor() {
    this.cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
      credentials: {
        accessKeyId: cognito.accessKeyId,
        secretAccessKey: cognito.secretAccessKey,
      },
      region: cognito.region,
    });
    this.cognitoIdentityProvider = new CognitoIdentityProvider({
      credentials: {
        accessKeyId: cognito.accessKeyId,
        secretAccessKey: cognito.secretAccessKey,
      },
      region: cognito.region,
      apiVersion: "2016-04-18",
    });
  }

  static get(): AwsCognito {
    if (!AwsCognito.instance) {
      AwsCognito.instance = new AwsCognito();
    }
    return AwsCognito.instance;
  }

  verifyToken = (token: string): Promise<CognitoAccessTokenPayload> => {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: cognito.userPoolId,
      tokenUse: "access",
      clientId: cognito.clientId,
    });

    return verifier.verify(token);
  };

  getCognitoUser = (token: string): Promise<GetUserCommandOutput> => {
    const command = new GetUserCommand({
      AccessToken: token,
    });
    return this.cognitoIdentityProviderClient.send(command);
  };

  signUp = (input: InputUserInterface): Promise<SignUpCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
      Password: input.password,
      UserAttributes: [
        {
          Name: "email",
          Value: input.email,
        },
        {
          Name: "name",
          Value: input.name,
        },
        {
          Name: "phone_number",
          Value: input.phoneNumber || "",
        },
      ],
    } as SignUpCommandInput;
    return this.cognitoIdentityProvider.signUp(params);
  };

  confirmSignUp = (
    input: InputConfirmSignUpInterface
  ): Promise<ConfirmSignUpCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
      ConfirmationCode: input.confirmationCode,
    } as ConfirmSignUpCommandInput;
    return this.cognitoIdentityProvider.confirmSignUp(params);
  };

  resendConfirmationCode = (
    input: InputResendConfirmationCodeInterface
  ): Promise<ResendConfirmationCodeCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
    } as ResendConfirmationCodeCommandInput;
    return this.cognitoIdentityProvider.resendConfirmationCode(params);
  };

  adminCreateUser = (
    input: InputUserInterface
  ): Promise<AdminCreateUserCommandOutput> => {
    const userAttributes: AttributeType[] = [
      {
        Name: "email",
        Value: input.email,
      },
      {
        Name: "name",
        Value: input.name,
      },
      {
        Name: "phone_number",
        Value: input.phoneNumber || "",
      },
    ];
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: input.username,
      TemporaryPassword: input.password,
      UserAttributes: userAttributes,
    } as AdminCreateUserCommandInput;
    return this.cognitoIdentityProvider.adminCreateUser(params);
  };

  authenticateUser = (
    input: InputAuthLoginInterface
  ): Promise<CognitoUserSession> => {
    const authenticationData = {
      Username: input.email,
      Password: input.password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.clientId,
    };
    const userPool: CognitoUserPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: input.email,
      Pool: userPool,
    });

    return new Promise(function (resolve, reject): CognitoUserSession | void {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (user: CognitoUserSession) {
          resolve(user);
        },
        onFailure: function (error: any) {
          reject(error);
        },
      });
    });
  };

  forgotPassword = (
    input: InputUserInterface
  ): Promise<ForgotPasswordCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
    } as ForgotPasswordCommandInput;

    return this.cognitoIdentityProvider.forgotPassword(params);
  };

  confirmForgotPassword = (
    input: InputConfirmForgotPasswordInterface
  ): Promise<string> => {
    const poolData = {
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.clientId,
    };
    const userPool: CognitoUserPool = new CognitoUserPool(poolData);

    const cognitoUser = new CognitoUser({
      Username: input.email,
      Pool: userPool,
    });

    return new Promise(function (resolve, reject): string | void {
      cognitoUser.confirmPassword(input.verificationCode, input.newPassword, {
        onSuccess: function (message) {
          resolve(message);
        },
        onFailure: function (error) {
          reject(error);
        },
      });
    });
  };

  adminGetUser = ({
    email,
  }: InputResendConfirmationCodeInterface): Promise<AdminGetUserCommandOutput> => {
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: email,
    } as AdminGetUserCommandInput;
    return this.cognitoIdentityProvider.adminGetUser(params);
  };
}

const awsCognito = AwsCognito.get();

export { awsCognito as AwsCognito };