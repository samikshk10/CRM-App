import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import { cognito } from "../config";
  
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
 }
  
  const awsCognito = AwsCognito.get();
  
  export { awsCognito as AwsCognito };
  