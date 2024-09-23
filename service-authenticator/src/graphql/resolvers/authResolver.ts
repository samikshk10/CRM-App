import {
  InputAuthLoginInterface,
  InputChangePasswordInterface,
  InputConfirmForgotPasswordInterface,
  InputForgotPasswordInterface,
  TokenInterface,
} from "./../../interfaces";
import { UserConfirmationEnum } from "../../enums";
import {
  ContextInterface,
  InputConfirmSignUpInterface,
  InputUserInterface,
} from "../../interfaces";
import { Guard, Validator } from "../../middlewares";
import { AwsCognito } from "../../utils";
import {
  authMe,
  confirmSignUp,
  login,
  resendConfirmationCode,
  signUp,
  changePassword,
  forgotPassword,
  confirmForgotPassword,
} from "../../validators";
import { SuccessResponse } from "../../helpers";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { UserService } from "../../services";

export const authResolvers = {
  Mutation: {
    signUp: async (
      parent: ParentNode,
      args: { input: InputUserInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Validator.check(signUp, args.input);
      const { name, email, phoneNumber } = args.input;
      try {
        const awsUser = await AwsCognito.signUp(args.input);
        const user = await new UserService().create({
          sub: awsUser.UserSub,
          name,
          username: awsUser.UserSub,
          email,
          phoneNumber,
        });

        await new UserService().updateById(user.id, { ownerId: user.id });
      } catch (error: any) {
        if (error.name === "UsernameExistsException") {
          const email = args.input.email as string;
          const adminGetUser = await AwsCognito.adminGetUser({ email: email });
          if (adminGetUser.UserStatus === UserConfirmationEnum.UNCONFIRMED) {
            await AwsCognito.resendConfirmationCode({
              email: email,
            });
            return SuccessResponse.send({
              message: "User already registered, Please verify your email.",
              data: { email },
            });
          }
        }
        throw error;
      }
      return SuccessResponse.send({
        message: "User has been successfully registered",
        data: { email: args.input.email },
      });
    },

    resendConfirmationCode: async (
      parent: ParentNode,
      args: { input: InputConfirmSignUpInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Validator.check(resendConfirmationCode, args.input);
      const userExists = await new UserService().findOne({
        email: args.input.email,
      });

      if (!userExists)
        throw new GraphQLError(`Resend Email Failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Email ${args.input.email} does not exists.`,
            attribute: "Email",
          },
        });
      await AwsCognito.resendConfirmationCode(args.input);
      return SuccessResponse.send({
        message: "Confirmation code is resend successfully.",
      });
    },

    confirmSignUp: async (
      parent: ParentNode,
      args: { input: InputConfirmSignUpInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Validator.check(confirmSignUp, args.input);
      const userExists = await new UserService().findOne({
        email: args.input.email,
      });

      if (!userExists)
        throw new GraphQLError(`Confirm user failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `: Email ${args.input.email} does not exists.`,
            attribute: "Email",
          },
        });
      await AwsCognito.confirmSignUp(args.input);
      await new UserService().update(
        {
          email: args.input.email,
        },
        {
          emailVerified: true,
        }
      );
      return SuccessResponse.send({
        message: "User has been successfully confirm.",
      });
    },

    login: async (
      parent: ParentNode,
      args: { input: InputAuthLoginInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      try {
        Validator.check(login, args.input);
        let user = {};
        const awsCognitoAuth = await AwsCognito.authenticateUser(args.input);
        const access = awsCognitoAuth.getAccessToken().getJwtToken() as string;
        const refresh = awsCognitoAuth.getRefreshToken().getToken() as string;
        const sub = awsCognitoAuth.getAccessToken().payload.sub as string;
        const subExists = await new UserService().findOne({ sub: sub });
        if (!subExists)
          throw new GraphQLError(`User not found`, {
            extensions: {
              code: "BAD_USER_INPUT",
              status: 404,
              message: `: User with email ${args.input.email} does not exists.`,
              attribute: "Email",
            },
          });
        else user = await new UserService().findByPk(subExists.id);
        return SuccessResponse.send({
          message: "Login successfully",
          data: {
            token: {
              access: access,
              refresh: refresh,
            },
          },
        });
      } catch (error) {
        return error;
      }
    },

    authMe: async (
      parent: ParentNode,
      args: { input: InputUserInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(authMe, args.input);

      if (args.input.name) {
        await AwsCognito.updateUser({
          name: args.input.name,
          accessToken: context.authorization,
        });
      }

      const data = await new UserService().updateOne(user.id, args.input);

      return SuccessResponse.send({
        message: "Auth user successfully updated.",
        data,
      });
    },

    changePassword: async (
      parent: ParentNode,
      args: { input: InputChangePasswordInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Guard.grant(context.user);

      Validator.check(changePassword, args.input);
      const token = context.authorization as string;
      await AwsCognito.changePassword({ ...args.input, accessToken: token });

      return SuccessResponse.send({
        message: "Password changed successfully",
      });
    },

    forgotPassword: async (
      parent: ParentNode,
      args: { input: InputForgotPasswordInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Validator.check(forgotPassword, args.input);
      const userExists = await new UserService().findOne({
        email: args.input.email,
      });

      if (!userExists)
        throw new GraphQLError(`Forgot password failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Email ${args.input.email} does not exists.`,
            attribute: "Email",
          },
        });
      await AwsCognito.forgotPassword(args.input);

      return SuccessResponse.send({
        message:
          "A verification code sent to you email. Use it to set new password.",
        data: {
          email: args.input.email,
        },
      });
    },

    confirmForgotPassword: async (
      parent: ParentNode,
      args: { input: InputConfirmForgotPasswordInterface }
    ) => {
      Validator.check(confirmForgotPassword, args.input);
      const userExists = await new UserService().findOne({
        email: args.input.email,
      });

      if (!userExists)
        throw new GraphQLError(`Forgot password failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Email ${args.input.email} does not exists.`,
            attribute: "Email",
          },
        });

      await AwsCognito.confirmForgotPassword(args.input);

      return SuccessResponse.send({
        message: "Password reset successful.",
      });
    },

    refreshToken: async (
      parent: ParentNode,
      args: { input: TokenInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      const { refreshToken } = args.input;
      const { AuthenticationResult } = await AwsCognito.accessToken(
        refreshToken!
      );
      return SuccessResponse.send({
        message: "Access token fetched successfully",
        data: {
          access: AuthenticationResult?.AccessToken,
        },
      });
    },
  },

  Query: {
    authMe: async (
      parent: ParentNode,
      {},
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      const user = Guard.grant(context.user);
      const data = await new UserService().findByPk(user.id);
      return SuccessResponse.send({
        message: "Auth user is successfully fetched.",
        data: data,
      });
    },
  },
};
