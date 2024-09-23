import {
  AdminConfirmSignUpCommandInput,
  AdminConfirmSignUpCommandOutput,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminGetUserCommandInput,
  AdminGetUserCommandOutput,
  AdminUpdateUserAttributesCommandInput,
  AttributeType,
  ChangePasswordCommandInput,
  ChangePasswordCommandOutput,
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommandInput,
  ForgotPasswordCommandOutput,
  GetUserCommand,
  GetUserCommandOutput,
  GlobalSignOutCommandInput,
  GlobalSignOutCommandOutput,
  InitiateAuthCommandOutput,
  ResendConfirmationCodeCommandInput,
  ResendConfirmationCodeCommandOutput,
  SignUpCommandInput,
  SignUpCommandOutput,
  UpdateUserPoolCommandOutput,
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
  InputAuthTokenInterface,
  InputChangePasswordInterface,
  InputConfirmForgotPasswordInterface,
  InputConfirmSignUpInterface,
  InputResendConfirmationCodeInterface,
  InputUserInterface,
} from "../interfaces";
import { error } from "loglevel";

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

  public verifyToken = async (
    token: string
  ): Promise<CognitoAccessTokenPayload> => {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: cognito.userPoolId,
      tokenUse: "access",
      clientId: cognito.clientId,
    });

    return verifier.verify(token);
  };

  public getCognitoUser = async (
    token: string
  ): Promise<GetUserCommandOutput> => {
    const command = new GetUserCommand({
      AccessToken: token,
    });
    return this.cognitoIdentityProviderClient.send(command);
  };

  public signUp = async (
    input: InputUserInterface
  ): Promise<SignUpCommandOutput> => {
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

  public confirmSignUp = async (
    input: InputConfirmSignUpInterface
  ): Promise<ConfirmSignUpCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
      ConfirmationCode: input.confirmationCode,
    } as ConfirmSignUpCommandInput;
    return this.cognitoIdentityProvider.confirmSignUp(params);
  };

  public resendConfirmationCode = async (
    input: InputResendConfirmationCodeInterface
  ): Promise<ResendConfirmationCodeCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
    } as ResendConfirmationCodeCommandInput;
    return this.cognitoIdentityProvider.resendConfirmationCode(params);
  };

  public adminCreateUser = async (
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

  public authenticateUser = async (
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

  public forgotPassword = async (
    input: InputUserInterface
  ): Promise<ForgotPasswordCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
    } as ForgotPasswordCommandInput;

    return this.cognitoIdentityProvider.forgotPassword(params);
  };

  public confirmForgotPassword = async (
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

  public changePassword = async (
    input: InputChangePasswordInterface
  ): Promise<ChangePasswordCommandOutput> => {
    const params = {
      AccessToken: input.accessToken,
      PreviousPassword: input.previousPassword,
      ProposedPassword: input.proposedPassword,
    } as ChangePasswordCommandInput;

    return this.cognitoIdentityProvider.changePassword(params);
  };

  public adminGetUser = async ({
    email,
  }: InputResendConfirmationCodeInterface): Promise<AdminGetUserCommandOutput> => {
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: email,
    } as AdminGetUserCommandInput;
    return this.cognitoIdentityProvider.adminGetUser(params);
  };

  public signOut = async (
    input: InputAuthTokenInterface
  ): Promise<GlobalSignOutCommandOutput> => {
    var params = {
      AccessToken: input.accessToken,
    } as GlobalSignOutCommandInput;
    return this.cognitoIdentityProvider.globalSignOut(params);
  };

  public accessToken = async (
    refreshToken: string
  ): Promise<InitiateAuthCommandOutput> => {
    const params = {
      AuthFlow: "REFRESH_TOKEN",
      ClientId: cognito.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };
    return this.cognitoIdentityProvider.initiateAuth(params);
  };

  public updateUser = async (
    input: InputUserInterface
  ): Promise<UpdateUserPoolCommandOutput> => {
    const params = {
      AccessToken: input.accessToken,
      UserAttributes: [
        {
          Name: "name",
          Value: input.name,
        },
      ],
    };

    return this.cognitoIdentityProvider.updateUserAttributes(params);
  };

  public adminUpdateUser = async (
    input: InputUserInterface
  ): Promise<UpdateUserPoolCommandOutput> => {
    let inputWhere = {};

    if (input.phoneNumberVerified) {
      inputWhere = {
        Name: "phone_number_verified",
        Value: "true",
      };
    }
    if (input.phoneNumber) {
      inputWhere = {
        Name: "phone_number",
        Value: input.phoneNumber,
      };
    }

    const params = {
      UserAttributes: [inputWhere],
      UserPoolId: cognito.userPoolId,
      Username: input.sub,
    } as AdminUpdateUserAttributesCommandInput;
    return this.cognitoIdentityProvider.adminUpdateUserAttributes(params);
  };

  public adminConfirmSignUp = async ({
    username,
  }: {
    username: string;
  }): Promise<AdminConfirmSignUpCommandOutput> => {
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: username,
    } as AdminConfirmSignUpCommandInput;
    return this.cognitoIdentityProvider.adminConfirmSignUp(params);
  };
}

const awsCognito = AwsCognito.get();

export { awsCognito as AwsCognito };
