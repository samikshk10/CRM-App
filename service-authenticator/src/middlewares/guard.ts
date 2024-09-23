import { GraphQLError } from "graphql";
import {
  UserInterface,
} from "./../interfaces/userInterface";
import { AwsCognito } from "../utils";
import { UserService } from "../services";
class Guard {
  private static instance: Guard;

  private constructor() {}

  static get(): Guard {
    if (!Guard.instance) Guard.instance = new Guard();
    return Guard.instance;
  }

  public auth = async (token: string): Promise<UserInterface | undefined> => {
    try {
      const verify = await AwsCognito.verifyToken(token);
      const userExists = await new UserService().findOne({
        sub: verify.sub,
      });

      if (!userExists) {
        throw new GraphQLError(`Auth Failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 401,
            message: `Token provided is invalid or user does not exist.`,
            argumentName: "authorization",
          },
        });
      }
      return userExists;
    } catch (error: any) {
      if (error.failedAssertion) {
        return undefined;
      } else {
        throw new GraphQLError(`Auth Failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 401,
            message: `Token provided is invalid or user does not exist.`,
            argumentName: "authorization",
          },
        });
      }
    }
  };

  public grant = (user: UserInterface | undefined): UserInterface => {
    if (!user) {
      throw new GraphQLError(`Auth Failed`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 401,
          message: `Token provided is invalid or user does not exist. inside guard middleware`,
          argumentName: "authorization",
        },
      });
    }
    return user;
  };
}

const guard = Guard.get();

export { guard as Guard };
